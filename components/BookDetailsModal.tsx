import React, { useEffect, useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Book, BookDeepDetails } from '../types';
import { getBookDeepDive } from '../services/geminiService';
import { Loader2, BookOpen, Quote, List, Star, TrendingUp, Gem } from 'lucide-react';

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ isOpen, onClose, book }) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<BookDeepDetails | null>(null);

  useEffect(() => {
    if (isOpen && book) {
      loadDetails();
    } else {
      setDetails(null);
    }
  }, [isOpen, book]);

  const loadDetails = async () => {
    if (!book) return;
    setLoading(true);
    const data = await getBookDeepDive(book.title, book.author);
    setDetails(data);
    setLoading(false);
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" className="max-w-2xl bg-slate-50">
      <div className="relative -mt-6 -mx-6 mb-6 h-32 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden flex items-end p-6">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 text-white">
             <h2 className="text-2xl font-bold leading-tight">{book.title}</h2>
             <p className="text-blue-100 font-medium">{book.author}</p>
        </div>
      </div>

      <div className="space-y-6 px-2">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white border-slate-200">
                {book.category}
            </Badge>
            {book.isTrending && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                    <TrendingUp className="w-3 h-3 mr-1" /> Trending
                </Badge>
            )}
            {book.isRareFind && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                    <Gem className="w-3 h-3 mr-1" /> Rare Find
                </Badge>
            )}
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="text-sm">Consulting our AI librarian...</p>
           </div>
        ) : details ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                
                {/* Core Concepts */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
                   <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                       <List className="h-4 w-4" /> Core Concepts
                   </h3>
                   <ul className="space-y-2">
                       {details.coreConcepts.map((concept, i) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                               <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                               {concept}
                           </li>
                       ))}
                   </ul>
                </div>

                {/* NYT Review */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
                   <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                       <Quote className="h-4 w-4" /> Review
                   </h3>
                   <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-indigo-500 pl-3">
                       "{details.nytReview}"
                   </p>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-semibold uppercase">Est. Chapters</p>
                        <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" /> 
                            {details.chapterCount}
                        </p>
                    </div>
                    <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                        <p className="text-xs text-green-600 font-semibold uppercase">Why Read This?</p>
                        <p className="text-xs text-slate-700 font-medium leading-tight mt-1">
                            {details.matchReason}
                        </p>
                    </div>
                </div>

            </div>
        ) : (
            <div className="text-center py-8 text-muted-foreground">
                <p>Unable to load book details.</p>
            </div>
        )}

        <div className="flex justify-end pt-2">
             <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};