
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Sparkles, Loader2, BookOpen, AlertTriangle, Upload, Image as ImageIcon, X, Edit2 } from 'lucide-react';
import { generateBookMetadata } from '../services/geminiService';
import { getBookByISBN, searchBookByQuery } from '../lib/book-service';
import { Book } from '../types';

// Simple ID generator for the demo
const generateId = () => Math.random().toString(36).substr(2, 9);

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: Book) => void;
  books: Book[];
}

interface BookFormData {
  title: string;
  author: string;
  description: string;
  category: string;
  coverUrl: string;
  isbn: string;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAdd, books }) => {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState('');
  
  // Editable Form State
  const [formData, setFormData] = useState<BookFormData | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for duplicates
  useEffect(() => {
    const checkTitle = formData?.title || searchInput;
    if (!checkTitle.trim()) {
        setDuplicateWarning('');
        return;
    }
    const isDuplicate = books.some(b => b.title.toLowerCase() === checkTitle.trim().toLowerCase());
    if (isDuplicate) {
        setDuplicateWarning('Warning: This book is already in the catalog.');
    } else {
        setDuplicateWarning('');
    }
  }, [searchInput, formData?.title, books]);

  const handleSmartFill = async () => {
    const input = searchInput.trim();
    if (!input) return;
    
    setLoading(true);
    setError('');
    setFormData(null); // Clear previous results while loading
    
    try {
      let resultData: BookFormData | null = null;
      
      // 1. Check if input is ISBN-like
      const cleanInput = input.replace(/[- ]/g, '');
      const isIsbnLike = /^(978|979|)\d{9}[\dX]$/i.test(cleanInput);

      if (isIsbnLike) {
          const book = await getBookByISBN(cleanInput);
          if (book) {
              resultData = { ...book, coverUrl: book.coverUrl || '' };
          }
      }

      // 2. If not ISBN, try searching Google Books by title first (better ISBN matching for OpenLibrary covers)
      if (!resultData && !isIsbnLike) {
          const searchResult = await searchBookByQuery(input);
          if (searchResult) {
              resultData = searchResult;
          }
      }

      // 3. If direct lookup/search failed, ask AI as last resort
      if (!resultData) {
          const aiData = await generateBookMetadata(input);
          if (aiData) {
              // AI found an ISBN? Try to upgrade to real cover
              // Default to AI Category for placeholder text
              let coverUrl = `https://placehold.co/400x600/e2e8f0/1e293b?text=${encodeURIComponent(aiData.category)}+Book`;
              let finalTitle = input; 
              let finalIsbn = aiData.isbn || '';

              if (aiData.isbn) {
                  const realBook = await getBookByISBN(aiData.isbn);
                  if (realBook) {
                      // Found real metadata from ISBN derived by AI
                      coverUrl = realBook.coverUrl;
                      finalTitle = realBook.title;
                      // Prefer API category if available, else AI category
                      aiData.category = realBook.category || aiData.category;
                  } else {
                      // AI ISBN valid but not found in GBooks? Fallback to OL Cover directly
                      const cleanIsbn = aiData.isbn.replace(/[- ]/g, '');
                      coverUrl = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;
                  }
              }

              resultData = {
                  title: finalTitle,
                  author: aiData.author,
                  category: aiData.category,
                  description: aiData.description,
                  coverUrl: coverUrl,
                  isbn: finalIsbn
              };
          }
      }

      if (resultData) {
          // Capitalize title nicely
          const formattedTitle = resultData.title.trim().charAt(0).toUpperCase() + resultData.title.trim().slice(1);
          setFormData({
              ...resultData,
              title: formattedTitle
          });
      } else {
        setError('Could not find book details. You can enter them manually below.');
        // Initialize empty form for manual entry
        setFormData({
            title: input,
            author: '',
            category: 'General',
            description: '',
            coverUrl: `https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover`,
            isbn: ''
        });
      }
    } catch (err) {
      setError('Service unavailable. Please enter details manually.');
      setFormData({
            title: input,
            author: '',
            category: 'General',
            description: '',
            coverUrl: `https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover`,
            isbn: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && formData) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData({ ...formData, coverUrl: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const newBook: Book = {
      id: generateId(),
      title: formData.title,
      author: formData.author,
      description: formData.description,
      category: formData.category,
      coverUrl: formData.coverUrl,
      isbn: formData.isbn,
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
    };

    onAdd(newBook);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSearchInput('');
    setFormData(null);
    setError('');
    setDuplicateWarning('');
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title="Add New Book" className="max-w-xl">
      <div className="space-y-6">
        
        {/* Search / Auto-fill Section */}
        <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step 1: Search & Auto-Fill</label>
            <div className="flex gap-2">
            <Input 
                placeholder="Enter Title or ISBN (e.g. 9780...)" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && handleSmartFill()}
            />
            <Button onClick={handleSmartFill} disabled={!searchInput || loading} className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Auto-Fill
            </Button>
            </div>
            {error && <p className="text-sm text-amber-600 flex items-center"><AlertTriangle className="h-3 w-3 mr-1"/> {error}</p>}
        </div>

        {/* Duplicate Warning UI */}
        {duplicateWarning && (
            <div className="flex items-start gap-2 p-3 text-sm text-amber-700 bg-amber-50 rounded-md border border-amber-200 animate-in fade-in slide-in-from-top-1">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-medium">{duplicateWarning}</span>
            </div>
        )}

        {/* Separator */}
        {formData && <div className="border-t border-slate-100 my-4"></div>}

        {/* Editable Form Section */}
        {formData && (
          <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="flex gap-5">
                 {/* Cover Upload Area */}
                 <div className="shrink-0 space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Cover Image</label>
                     <div 
                        className="relative h-44 w-28 overflow-hidden rounded-lg shadow-md bg-slate-100 group cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all"
                        onClick={() => fileInputRef.current?.click()}
                     >
                        <img 
                            src={formData.coverUrl} 
                            alt="Cover" 
                            className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/400x600/e2e8f0/1e293b?text=No+Cover`;
                            }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="h-6 w-6 text-indigo-700 mb-1" />
                            <span className="text-[10px] font-bold text-indigo-700 uppercase bg-white/80 px-2 py-0.5 rounded">Upload</span>
                        </div>
                     </div>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload} 
                     />
                 </div>

                 {/* Metadata Inputs */}
                 <div className="flex-grow space-y-3">
                     <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Book Title</label>
                        <Input 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="font-medium"
                        />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Author</label>
                            <Input 
                                value={formData.author} 
                                onChange={(e) => setFormData({...formData, author: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Category</label>
                            <Input 
                                value={formData.category} 
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                placeholder="Auto-classified"
                            />
                        </div>
                     </div>

                     <div className="space-y-1">
                         <label className="text-xs font-medium text-slate-500">ISBN</label>
                         <Input 
                             value={formData.isbn} 
                             onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                             placeholder="Optional ISBN"
                         />
                     </div>

                     <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Description</label>
                        <textarea 
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                     </div>
                 </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
              <Button type="submit" disabled={!formData.title || !formData.author}>Confirm & Add Book</Button>
            </div>
          </form>
        )}
        
        {!formData && !loading && (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground space-y-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <BookOpen className="h-8 w-8 opacity-20" />
            <p className="text-xs max-w-xs">
                Search to auto-fill details (covers sourced from OpenLibrary), then review or edit them before adding.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
