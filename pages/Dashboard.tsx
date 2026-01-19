
import React, { useEffect, useState, useMemo } from 'react';
import { Book, User } from '../types';
import { mockDb } from '../services/mockDb';
import { BookCard } from '../components/BookCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AddBookModal } from '../components/AddBookModal';
import { RecommendationModal } from '../components/RecommendationModal';
import { BorrowModal } from '../components/BorrowModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { RestoreModal } from '../components/RestoreModal';
import { BookDetailsModal } from '../components/BookDetailsModal';
import { Plus, Search, LogOut, Library, Sparkles, Heart, BookOpen, Inbox, BookOpenCheck, Trash2, X, CheckSquare, RotateCcw, ArrowUpDown, ArrowLeft, ChevronDown, Check } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// --- Fuzzy Search Utilities ---

// Calculate Levenshtein distance between two strings
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = [];

  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Increment along the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,   // insertion
            matrix[i - 1][j] + 1    // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const isFuzzyMatch = (text: string, query: string): boolean => {
    if (!text || !query) return false;
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    // 1. Direct includes match (fastest)
    if (normalizedText.includes(normalizedQuery)) return true;

    // 2. ISBN Logic: Remove dashes if query looks like a number
    const isNumberQuery = /^[\d-]+$/.test(normalizedQuery);
    if (isNumberQuery) {
        const cleanText = normalizedText.replace(/-/g, '');
        const cleanQuery = normalizedQuery.replace(/-/g, '');
        return cleanText.includes(cleanQuery);
    }

    // 3. Fuzzy Match (for spelling mistakes in Title/Author)
    // Don't fuzz short queries (noise)
    if (normalizedQuery.length < 3) return false;

    // Split text into words to check against query words
    const words = normalizedText.split(/\s+/);
    
    // Check if ANY word in the text is close to the query
    // Tolerance: 1 error for 3-5 chars, 2 errors for 6+ chars
    return words.some(word => {
        const distance = levenshteinDistance(word, normalizedQuery);
        const tolerance = word.length > 5 ? 2 : 1;
        return distance <= tolerance;
    });
};

type SortOption = 'POPULAR' | 'TRENDING' | 'RATING' | 'NEWEST' | 'ALPHA';

// Helper to generate a consistent pseudo-rating if missing (for demo purposes)
const getBookRating = (book: Book): number => {
    if (book.rating) return book.rating;
    
    // Deterministic hash based on ID to generate a float between 3.5 and 4.9
    let hash = 0;
    for (let i = 0; i < book.id.length; i++) {
        hash = ((hash << 5) - hash) + book.id.charCodeAt(i);
        hash |= 0;
    }
    const normalized = Math.abs(hash) % 15; // 0-14
    return 3.5 + (normalized / 10);
};

export const Dashboard: React.FC<DashboardProps> = ({ user: initialUser, onLogout }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [books, setBooks] = useState<Book[]>([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'BROWSE' | 'WISHLIST' | 'MY_BOOKS'>('BROWSE');
  const [sortOption, setSortOption] = useState<SortOption>('POPULAR');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  
  // Selection Mode State (Admin Only)
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());

  // Navigation Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [borrowModal, setBorrowModal] = useState<{ isOpen: boolean, book: Book | null }>({ isOpen: false, book: null });
  const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean, book: Book | null }>({ isOpen: false, book: null });

  // Alert/Delete Modal State
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: 'danger' | 'warning';
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', description: '', variant: 'warning' });

  useEffect(() => {
    refreshData();
    // Run background enrichment script to fetch real covers
    // This iterates through the list and replaces placeholders with Google Books thumbnails
    mockDb.refreshCovers().then((didUpdate) => {
        if (didUpdate) refreshData();
    });
  }, []);

  const refreshData = () => {
      setBooks(mockDb.getBooks());
      setDeletedCount(mockDb.getDeletedBooks().length);
      const updatedUser = mockDb.getCurrentUser();
      if (updatedUser) setUser(updatedUser);
  };

  const filteredBooks = useMemo(() => {
    // 1. Filter by Tab & Search
    const searchMatches = (book: Book) => {
        if (!search) return true;
        
        return (
            isFuzzyMatch(book.title, search) || 
            isFuzzyMatch(book.author, search) || 
            (book.isbn && isFuzzyMatch(book.isbn, search))
        );
    };

    let result = books;

    // Apply Tab Filtering
    if (activeTab === 'WISHLIST') {
        result = books.filter(b => searchMatches(b) && user.interestedBookIds.includes(b.id));
    } else if (activeTab === 'MY_BOOKS') {
        result = books.filter(b => searchMatches(b) && b.borrowedBy === user.id);
    } else {
        // BROWSE
        result = books.filter(searchMatches);
    }

    // Apply "Available Only" Filter
    // Note: We don't apply this in "My Books" because borrowed books are by definition unavailable to others, 
    // and if I'm looking at my books, I know I have them.
    if (showAvailableOnly && activeTab !== 'MY_BOOKS') {
        result = result.filter(b => b.status === 'AVAILABLE');
    }

    // 2. Sort Logic
    return result.sort((a, b) => {
        if (sortOption === 'ALPHA') {
            return a.title.localeCompare(b.title);
        } else if (sortOption === 'NEWEST') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOption === 'RATING') {
            // Sort by Rating Descending
            return getBookRating(b) - getBookRating(a);
        } else if (sortOption === 'TRENDING') {
             // Priority: Trending flag (Wishlist logic simulation)
             const getScore = (book: Book) => {
                 if (book.isTrending) return 2;
                 if (user.interestedBookIds.includes(book.id)) return 1;
                 return 0;
             }
             return getScore(b) - getScore(a);
        } else if (sortOption === 'POPULAR') {
            // Default "Most Popular": Combined Clicks (Trending) + Reads (Borrowed) + Rating
            // High weight to Borrowed (Active Reads) and Trending (Hot)
            const getScore = (book: Book) => {
                let score = 0;
                if (book.status === 'BORROWED') score += 5; // High activity
                if (book.isTrending) score += 3; // Hot topic
                score += (getBookRating(book) / 2); // Rating influence (approx 2.5 pts max)
                return score;
            }
            return getScore(b) - getScore(a);
        }
        return 0;
    });

  }, [books, search, activeTab, user, sortOption, showAvailableOnly]);

  const handleAddBook = (book: Book) => {
    mockDb.addBook(book);
    refreshData();
  };

  const handleDeleteBook = (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    if (book.status === 'BORROWED') {
        setAlertModal({
            isOpen: true,
            title: "Cannot Delete Borrowed Book",
            description: `"${book.title}" is currently borrowed.\n\nTo maintain records, books cannot be deleted while they are checked out. Please wait for the book to be returned.`,
            variant: 'warning'
        });
    } else {
        setAlertModal({
            isOpen: true,
            title: "Delete Book?",
            description: `Are you sure you want to delete "${book.title}"?\nIt will be moved to "Deleted Books".`,
            variant: 'danger',
            onConfirm: () => {
                mockDb.deleteBook(id);
                setAlertModal(prev => ({ ...prev, isOpen: false }));
                refreshData();
            }
        });
    }
  };

  // --- Bulk Selection Logic ---

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedBookIds(new Set()); // Clear selection when toggling
  };

  const toggleBookSelection = (id: string) => {
    const next = new Set(selectedBookIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedBookIds(next);
  };

  const handleBulkDelete = () => {
    if (selectedBookIds.size === 0) return;
    
    // Check for borrowed books in selection
    const selectedBooks = books.filter(b => selectedBookIds.has(b.id));
    const borrowedBooks = selectedBooks.filter(b => b.status === 'BORROWED');

    if (borrowedBooks.length > 0) {
        setAlertModal({
            isOpen: true,
            title: "Cannot Delete Selection",
            description: `The following books are currently borrowed and cannot be deleted:\n\n${borrowedBooks.map(b => "• " + b.title).join("\n")}\n\nPlease deselect these books or wait for them to be returned.`,
            variant: 'warning'
        });
        return;
    }
    
    setAlertModal({
        isOpen: true,
        title: `Delete ${selectedBookIds.size} Books?`,
        description: `Are you sure you want to delete ${selectedBookIds.size} selected books?\nThey will be moved to "Deleted Books".`,
        variant: 'danger',
        onConfirm: () => {
            mockDb.deleteBooks(Array.from(selectedBookIds));
            setSelectedBookIds(new Set());
            setIsSelectionMode(false);
            setAlertModal(prev => ({ ...prev, isOpen: false }));
            refreshData();
        }
    });
  };

  // --- Transaction Logic ---

  // Step 1: Open Borrow Confirmation
  const initiateBorrow = (book: Book) => {
      setBorrowModal({ isOpen: true, book });
  };

  // Step 2: Confirm Borrow inside Modal
  const confirmBorrow = () => {
    if (!borrowModal.book) return;
    
    // Use the specialized transaction method
    const result = mockDb.borrowBook(borrowModal.book.id, user.id);
    
    if (result.success) {
        setUser(result.user); // Update local user state immediately
        setBooks(mockDb.getBooks()); // Update books to reflect status change
        setBorrowModal({ isOpen: false, book: null });
    } else {
        alert("Could not borrow book. It might have just been taken.");
        refreshData();
        setBorrowModal({ isOpen: false, book: null });
    }
  };

  const handleReturn = (bookId: string) => {
      const success = mockDb.returnBook(bookId);
      if (success) {
          refreshData();
      }
  };

  const handleToggleInterest = (book: Book) => {
      // Wrapper to handle toggle logic whether coming from card button or heart
      const updatedUser = mockDb.toggleInterest(book.id);
      if (updatedUser) {
          setUser(updatedUser);
      }
  };

  const handleSelectRecommendation = (bookId: string) => {
      setSearch('');
      setActiveTab('BROWSE');
      setTimeout(() => {
        const el = document.getElementById(`book-${bookId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
  }

  // Calculate counts for badges
  const wishlistCount = user.interestedBookIds.length;
  const myBooksCount = books.filter(b => b.borrowedBy === user.id).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-30 w-full border-b bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LOGO & NAVIGATION MENU AREA */}
          <div className="relative">
             <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex flex-col items-start hover:bg-white/10 p-2 -ml-2 rounded-lg transition-colors text-left focus:outline-none"
             >
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Library className="h-6 w-6" />
                    <span className="hidden sm:inline">Libri</span>
                    <ChevronDown className={`h-4 w-4 opacity-70 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </div>
                <span className="text-[10px] sm:text-xs font-light opacity-90 tracking-wide hidden md:block">
                    Personal and financial growth library powered by AI
                </span>
             </button>

             {/* Dropdown Menu */}
             {isMenuOpen && (
                <>
                    {/* Backdrop to handle click outside */}
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsMenuOpen(false)}></div>
                    
                    {/* Menu Items */}
                    <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border bg-white text-slate-900 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-black/5">
                        <div className="p-1.5 space-y-0.5">
                            <button
                                onClick={() => { setActiveTab('BROWSE'); setIsSelectionMode(false); setIsMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'BROWSE' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-700'}`}
                            >
                                <Library className="h-4 w-4" />
                                Browse Library
                            </button>
                            
                            <button
                                onClick={() => { setActiveTab('WISHLIST'); setIsSelectionMode(false); setIsMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'WISHLIST' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-700'}`}
                            >
                                <Heart className="h-4 w-4" />
                                My Wishlist
                                {wishlistCount > 0 && <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">{wishlistCount}</span>}
                            </button>
                            
                            <button
                                onClick={() => { setActiveTab('MY_BOOKS'); setIsSelectionMode(false); setIsMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'MY_BOOKS' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-700'}`}
                            >
                                <BookOpen className="h-4 w-4" />
                                My Borrowed
                                {myBooksCount > 0 && <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">{myBooksCount}</span>}
                            </button>
                            
                            <div className="h-px bg-slate-200 my-1 mx-2" />
                            
                            <button
                                onClick={() => { setIsRecModalOpen(true); setIsMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors group"
                            >
                                <Sparkles className="h-4 w-4 group-hover:text-indigo-600" />
                                AI Suggest
                            </button>
                        </div>
                    </div>
                </>
             )}
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium">
               {user.name}
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="hover:bg-white/20 text-primary-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        {/* Mobile Sub-Header for Slogan */}
        <div className="md:hidden bg-primary-foreground/10 py-1 text-center">
            <span className="text-[10px] font-light opacity-90 tracking-wide">
                Personal and financial growth library powered by AI
            </span>
        </div>
      </header>

      {/* Removed separate Mobile Nav Bar */}

      <main className="container mx-auto px-4 py-8">
        
        {/* Tab Headers / Intros */}
        <div className="mb-6">
            {activeTab === 'BROWSE' && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">Library Catalog</h1>
                        <p className="text-muted-foreground">Explore our collection of {books.length} curated books.</p>
                    </div>
                    
                    {/* Admin Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-start sm:items-center">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsRecModalOpen(true)}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 text-primary w-full sm:w-auto"
                        >
                        <Sparkles className="mr-2 h-4 w-4 text-primary" />
                        AI Suggest
                        </Button>
                        
                        {/* Sort Dropdown */}
                        <div className="relative inline-block w-full sm:w-auto">
                            <select
                                className="w-full sm:w-[220px] h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                            >
                                <option value="POPULAR">Most Popular (Default)</option>
                                <option value="TRENDING">Trending / Most Saved</option>
                                <option value="RATING">Highest Rated</option>
                                <option value="NEWEST">New Arrivals</option>
                                <option value="ALPHA">Title (A-Z)</option>
                            </select>
                            <ArrowUpDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                        
                        {user.role === 'ADMIN' && (
                            <>
                                <div className="hidden sm:block h-6 w-px bg-border mx-1"></div>
                                
                                {isSelectionMode ? (
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button variant="ghost" onClick={toggleSelectionMode} className="flex-1 sm:flex-none">
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleBulkDelete} disabled={selectedBookIds.size === 0} className="flex-1 sm:flex-none">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete ({selectedBookIds.size})
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setIsRestoreModalOpen(true)}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200 whitespace-nowrap"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Trash ({deletedCount})
                                        </Button>
                                        <Button variant="secondary" onClick={toggleSelectionMode}>
                                            <CheckSquare className="mr-2 h-4 w-4" />
                                            Select
                                        </Button>
                                        <Button onClick={() => setIsAddModalOpen(true)}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
            
            {activeTab === 'WISHLIST' && (
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-primary">
                            <Heart className="h-6 w-6 text-red-500 fill-red-500" /> 
                            My Wishlist
                        </h1>
                        <p className="text-muted-foreground">Books you've saved for later. Checkout when you are ready.</p>
                    </div>
                </div>
            )}

            {activeTab === 'MY_BOOKS' && (
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-primary">
                        <BookOpen className="h-6 w-6" />
                        Currently Borrowed
                    </h1>
                    <p className="text-muted-foreground">You have {myBooksCount} books checked out. Don't forget to return them!</p>
                </div>
            )}
        </div>

        {/* Navigation Tabs (Moved Below Header/Title, Before Search) */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button
                variant={activeTab === 'BROWSE' ? 'default' : 'secondary'}
                onClick={() => { setActiveTab('BROWSE'); setIsSelectionMode(false); }}
                className="rounded-full"
                size="sm"
            >
                Browse Library
            </Button>
            <Button
                variant={activeTab === 'WISHLIST' ? 'default' : 'secondary'}
                onClick={() => { setActiveTab('WISHLIST'); setIsSelectionMode(false); }}
                className="rounded-full"
                size="sm"
            >
                My Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Button>
            <Button
                variant={activeTab === 'MY_BOOKS' ? 'default' : 'secondary'}
                onClick={() => { setActiveTab('MY_BOOKS'); setIsSelectionMode(false); }}
                className="rounded-full"
                size="sm"
            >
                My Borrowed {myBooksCount > 0 && `(${myBooksCount})`}
            </Button>
            
            {/* Available Only Filter Toggle - Moved here */}
            {activeTab !== 'MY_BOOKS' && (
                 <button
                    onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                    className={`
                        inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 px-3 border border-dashed
                        ${showAvailableOnly 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-transparent border-slate-300 text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }
                    `}
                >
                    <div className={`flex items-center justify-center h-3.5 w-3.5 rounded-sm border mr-2 ${showAvailableOnly ? 'bg-emerald-600 border-emerald-600' : 'border-slate-400'}`}>
                        {showAvailableOnly && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    Available Only
                </button>
            )}

            {/* Back to All Books (Clear Search) */}
            {search && (
                 <Button
                    variant="ghost"
                    onClick={() => setSearch('')}
                    className="rounded-full text-muted-foreground hover:text-primary border border-dashed border-primary/30 hover:border-primary bg-background ml-auto sm:ml-0 h-8 sm:h-9"
                    size="sm"
                >
                    <ArrowLeft className="mr-2 h-3 w-3" />
                    Back to All Books
                </Button>
            )}
        </div>

        {/* Search Bar (Global across tabs) */}
        <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder={activeTab === 'BROWSE' ? "Search Title, Author, or ISBN..." : `Search in ${activeTab === 'WISHLIST' ? 'wishlist' : 'your books'}...`}
                className="pl-9 border-primary/20 focus:border-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        {/* Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredBooks.map((book) => {
                const isInterested = user.interestedBookIds.includes(book.id);
                
                // --- Dynamic Button Logic ---
                let primaryLabel = "Add to Wishlist";
                let primaryIcon = <Heart className="mr-2 h-4 w-4" />;
                let primaryAction = handleToggleInterest;
                let primaryDisabled = false;

                if (activeTab === 'WISHLIST') {
                    primaryLabel = "Borrow Now";
                    primaryIcon = <BookOpenCheck className="mr-2 h-4 w-4" />;
                    primaryAction = initiateBorrow;
                } else if (activeTab === 'BROWSE') {
                    if (isInterested) {
                        primaryLabel = "In Wishlist";
                        primaryIcon = undefined;
                        primaryDisabled = true; 
                    }
                }
                
                return (
                  <div key={book.id} id={`book-${book.id}`}>
                      <BookCard 
                        book={book} 
                        currentUser={user}
                        // Dynamic Actions based on Tab
                        onPrimaryAction={primaryAction}
                        primaryActionLabel={primaryLabel}
                        primaryActionIcon={primaryIcon}
                        isPrimaryActionDisabled={primaryDisabled}
                        
                        onReturn={handleReturn}
                        onDelete={handleDeleteBook}
                        
                        isInterested={isInterested}
                        onToggleInterest={(id) => handleToggleInterest(book)}

                        // Selection Mode Props
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedBookIds.has(book.id)}
                        onToggleSelection={toggleBookSelection}

                        // Filtering and Deep Dive
                        onAuthorClick={(author) => setSearch(author)}
                        onViewDetails={(b) => setDetailsModal({ isOpen: true, book: b })}
                      />
                  </div>
                );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/30">
             {activeTab === 'WISHLIST' ? (
                 <>
                    <Heart className="h-12 w-12 mb-4 text-muted-foreground/30" />
                    <p className="text-lg font-medium">Your wishlist is empty</p>
                    <p className="text-sm mb-4">Browse the library to find your next read.</p>
                    <Button variant="outline" onClick={() => setActiveTab('BROWSE')}>Browse Books</Button>
                 </>
             ) : activeTab === 'MY_BOOKS' ? (
                 <>
                    <Inbox className="h-12 w-12 mb-4 text-muted-foreground/30" />
                    <p className="text-lg font-medium">No books borrowed</p>
                    <p className="text-sm mb-4">It looks like you haven't checked out any books yet.</p>
                    <Button variant="outline" onClick={() => setActiveTab('BROWSE')}>Browse Books</Button>
                 </>
             ) : (
                 <>
                    <Search className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg">No books found.</p>
                    <p className="text-sm">Try adjusting your search query (we support fuzzy matching for typos).</p>
                    {showAvailableOnly && (
                        <Button variant="link" onClick={() => setShowAvailableOnly(false)} className="mt-2">
                            Show borrowed books
                        </Button>
                    )}
                 </>
             )}
          </div>
        )}

        <AddBookModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddBook} 
          books={books}
        />
        
        <RecommendationModal
            isOpen={isRecModalOpen}
            onClose={() => setIsRecModalOpen(false)}
            books={books}
            onSelectBook={handleSelectRecommendation}
        />

        <BorrowModal 
            isOpen={borrowModal.isOpen}
            book={borrowModal.book}
            onClose={() => setBorrowModal({ isOpen: false, book: null })}
            onConfirm={confirmBorrow}
        />

        <BookDetailsModal 
            isOpen={detailsModal.isOpen}
            onClose={() => setDetailsModal({ isOpen: false, book: null })}
            book={detailsModal.book}
        />

        <DeleteConfirmModal 
            isOpen={alertModal.isOpen}
            onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
            onConfirm={alertModal.onConfirm}
            title={alertModal.title}
            description={alertModal.description}
            variant={alertModal.variant}
        />

        <RestoreModal 
            isOpen={isRestoreModalOpen} 
            onClose={() => setIsRestoreModalOpen(false)}
            onRestoreSuccess={refreshData}
        />
      </main>
    </div>
  );
};
