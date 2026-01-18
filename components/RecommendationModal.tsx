import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Book } from '../types';
import { recommendBooks } from '../services/geminiService';
import { Loader2, Sparkles, BookOpen } from 'lucide-react';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectBook: (bookId: string) => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({ isOpen, onClose, books, onSelectBook }) => {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ book: Book, reason: string }[] | null>(null);

  const handleRecommend = async () => {
    if (!mood) return;
    setLoading(true);
    setResults(null);

    const recommendations = await recommendBooks(books, mood);
    
    if (recommendations && recommendations.length > 0) {
        const foundBooks = recommendations.map(rec => {
            const book = books.find(b => b.id === rec.bookId);
            return book ? { book, reason: rec.reason } : null;
        }).filter((item): item is { book: Book, reason: string } => item !== null);
        
        setResults(foundBooks);
    }
    setLoading(false);
  };

  const reset = () => {
      setMood('');
      setResults(null);
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => { reset(); onClose(); }} 
      title="Smart Librarian" 
      className={results ? "max-w-2xl" : "max-w-lg"}
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className={`space-y-4 transition-all duration-300 ${results ? 'hidden sm:block sm:opacity-50 hover:opacity-100' : ''}`}>
           {!results && (
              <p className="text-sm text-muted-foreground">
                Tell me how you're feeling or what you're looking for, and I'll pick the perfect books from our collection.
              </p>
           )}
           <div className="flex gap-2">
            <Input 
                placeholder="e.g., I want to learn about building wealth..." 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
            />
            <Button onClick={handleRecommend} disabled={!mood || loading} className="shrink-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
           </div>
        </div>

        {/* Results Section */}
        {results && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Top Recommendations</h3>
                    <Button variant="ghost" size="sm" onClick={reset} className="h-8 text-xs">Start Over</Button>
                </div>
                
                <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-1">
                    {results.map((item, idx) => (
                        <div key={item.book.id} className="group flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-all hover:shadow-sm">
                            <div className="shrink-0 relative h-24 w-16 overflow-hidden rounded shadow-sm bg-muted">
                                <img 
                                    src={item.book.coverUrl} 
                                    alt={item.book.title} 
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            
                            <div className="flex flex-col flex-grow justify-between py-0.5">
                                <div>
                                    <h4 className="font-semibold text-base leading-tight">{item.book.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">{item.book.author}</p>
                                </div>
                                
                                <p className="text-sm text-primary/90 italic border-l-2 border-indigo-400/30 pl-3 py-1 my-2 bg-indigo-50/50 rounded-r">
                                    "{item.reason}"
                                </p>
                            </div>

                            <div className="flex items-center">
                                 <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => { onSelectBook(item.book.id); onClose(); }}
                                 >
                                    View
                                 </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </Modal>
  );
};