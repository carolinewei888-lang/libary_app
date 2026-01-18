
import React, { useState, useEffect } from 'react';
import { Book, User } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Trash2, Heart, ArrowLeftRight, Check, TrendingUp, Gem, Eye, Book as BookIcon } from 'lucide-react';

interface BookCardProps {
  book: Book;
  currentUser: User;
  onPrimaryAction: (book: Book) => void;
  primaryActionLabel?: string;
  primaryActionIcon?: React.ReactNode;
  isPrimaryActionDisabled?: boolean;
  onReturn: (bookId: string) => void;
  onDelete: (id: string) => void;
  isInterested?: boolean;
  onToggleInterest?: (bookId: string) => void;
  // Selection Props
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
  // Filter & Detail Actions
  onAuthorClick?: (author: string) => void;
  onViewDetails?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  currentUser, 
  onPrimaryAction,
  primaryActionLabel = "Borrow",
  primaryActionIcon,
  isPrimaryActionDisabled = false,
  onReturn,
  onDelete, 
  isInterested = false,
  onToggleInterest,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
  onAuthorClick,
  onViewDetails
}) => {
  const [imgSrc, setImgSrc] = useState(book.coverUrl);
  
  // Update local state if prop changes (e.g. data refresh)
  useEffect(() => {
    setImgSrc(book.coverUrl);
  }, [book.coverUrl]);

  const isAvailable = book.status === 'AVAILABLE';
  const isAdmin = currentUser.role === 'ADMIN';
  const isBorrowedByMe = book.borrowedBy === currentUser.id;

  const handleCardClick = () => {
    if (isSelectionMode && onToggleSelection) {
      onToggleSelection(book.id);
    } else if (!isSelectionMode && onViewDetails) {
        onViewDetails(book);
    }
  };

  const handleImageError = () => {
      // Fallback 1: Try a high-quality abstract seed based on ID (guarantees an image)
      // This looks much better than a broken icon
      setImgSrc(`https://picsum.photos/seed/${book.id}/300/450`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`
        group rounded-xl border bg-card text-card-foreground shadow-sm transition-all overflow-visible flex flex-col h-full relative
        ${isSelectionMode ? 'cursor-pointer hover:shadow-md' : 'hover:shadow-lg cursor-pointer'}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted rounded-t-xl">
        <img 
            src={imgSrc} 
            alt={book.title}
            className={`h-full w-full object-cover transition-transform duration-300 ${isSelectionMode && !isSelected ? 'opacity-70 group-hover:opacity-100' : ''} ${!isSelectionMode ? 'group-hover:scale-105' : ''}`}
            loading="lazy"
            onError={handleImageError}
        />
        
        {/* Selection Overlay */}
        {isSelectionMode && (
          <div className={`absolute top-2 left-2 z-10 h-6 w-6 rounded border bg-background flex items-center justify-center transition-all ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
            {isSelected && <Check className="h-4 w-4" />}
          </div>
        )}

        {/* Top Badges */}
        {!isSelectionMode && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
            {isBorrowedByMe ? (
                <Badge className="bg-blue-600 text-white border-none shadow-sm text-[10px] px-1.5 h-5">My Book</Badge>
            ) : (
                <Badge variant={isAvailable ? 'success' : 'destructive'} className="shadow-sm text-[10px] px-1.5 h-5">
                  {isAvailable ? 'Available' : 'Borrowed'}
                </Badge>
            )}
            
            {/* New Decision Aid Badges */}
            {book.isTrending && (
                <Badge variant="secondary" className="bg-amber-100/90 text-amber-800 border-none backdrop-blur-sm shadow-sm text-[10px] px-1.5 h-5">
                    <TrendingUp className="w-3 h-3 mr-1" /> Trending
                </Badge>
            )}
            {book.isRareFind && (
                <Badge variant="secondary" className="bg-purple-100/90 text-purple-800 border-none backdrop-blur-sm shadow-sm text-[10px] px-1.5 h-5">
                    <Gem className="w-3 h-3 mr-1" /> Rare Find
                </Badge>
            )}
          </div>
        )}
        
        {/* Wishlist Heart Button - Hide in selection mode */}
        {!isSelectionMode && !isBorrowedByMe && onToggleInterest && (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleInterest(book.id);
                }}
                className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all active:scale-95 z-10"
            >
                <Heart 
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${isInterested ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                />
            </button>
        )}
        
        {/* Hover View Details Overlay hint */}
        {!isSelectionMode && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-0 pointer-events-none">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/40">
                    <Eye className="w-3 h-3 mr-1" /> View Details
                </Badge>
            </div>
        )}
      </div>
      
      {/* Content Area - Compact on mobile */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow space-y-2 sm:space-y-3 relative z-10 bg-card rounded-b-xl">
        <div>
          <h3 className="font-semibold text-sm sm:text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h3>
          
          {/* Author Link with Tooltip */}
          <div className="relative w-fit group/author">
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if (onAuthorClick) onAuthorClick(book.author);
                }}
                className="text-xs sm:text-sm text-primary font-medium mt-1 hover:underline text-left hover:text-blue-700 transition-colors"
              >
                {book.author}
              </button>
              
              {/* Tooltip */}
              <div className="absolute left-0 bottom-full mb-2 w-max max-w-[200px] hidden group-hover/author:block z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                 <div className="bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded shadow-lg leading-tight">
                    Click to view all books available for this author
                 </div>
                 {/* Tooltip Arrow */}
                 <div className="w-2 h-2 bg-slate-800 rotate-45 absolute left-4 -bottom-1"></div>
              </div>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 flex-grow">
          {book.description}
        </p>

        <div className="pt-2 flex items-center justify-between gap-2 mt-auto">
          {/* Action Buttons Logic - Hide all actions in selection mode */}
          
          {!isSelectionMode && (
            <>
              {/* Case 1: I have the book -> Return it */}
              {isBorrowedByMe && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-xs sm:text-sm text-blue-600 border-blue-200 hover:bg-blue-50 h-8 sm:h-9"
                    onClick={(e) => { e.stopPropagation(); onReturn(book.id); }}
                  >
                    <ArrowLeftRight className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">Return</span>
                  </Button>
              )}

              {/* Case 2: It is available -> Show Dynamic Primary Action (Wishlist or Borrow) */}
              {!isBorrowedByMe && isAvailable && (
                  <Button 
                    variant={isPrimaryActionDisabled ? "secondary" : "default"} 
                    size="sm"
                    className="w-full text-xs sm:text-sm h-8 sm:h-9 px-2"
                    onClick={(e) => { e.stopPropagation(); onPrimaryAction(book); }}
                    disabled={isPrimaryActionDisabled}
                  >
                    {primaryActionIcon}
                    {isPrimaryActionDisabled && !primaryActionIcon ? <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> : null}
                    <span className={`truncate ${primaryActionIcon || isPrimaryActionDisabled ? "ml-1 sm:ml-2" : ""}`}>
                        {primaryActionLabel}
                    </span>
                  </Button>
              )}

              {/* Case 3: Someone else has it -> Show disabled or generic */}
              {!isBorrowedByMe && !isAvailable && (
                <Button 
                    variant="secondary"
                    size="sm"
                    className="w-full opacity-50 cursor-not-allowed text-xs sm:text-sm h-8 sm:h-9"
                    disabled
                  >
                    Checked Out
                  </Button>
              )}

              {/* Admin Force Delete (Single) */}
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                  onClick={(e) => { e.stopPropagation(); onDelete(book.id); }}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </>
          )}

          {/* If in selection mode, show a dummy spacer or text to keep card height consistent if needed, or just let it collapse */}
          {isSelectionMode && (
             <p className="text-[10px] sm:text-xs text-center w-full text-muted-foreground">
               {isSelected ? 'Selected' : 'Click to select'}
             </p>
          )}
        </div>
      </div>
    </div>
  );
};
