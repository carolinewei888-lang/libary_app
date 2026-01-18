import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Book } from '../types';
import { mockDb } from '../services/mockDb';
import { RotateCcw, Trash2, AlertCircle } from 'lucide-react';

interface RestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export const RestoreModal: React.FC<RestoreModalProps> = ({ isOpen, onClose, onRestoreSuccess }) => {
  const [deletedBooks, setDeletedBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadDeletedBooks();
    }
  }, [isOpen]);

  const loadDeletedBooks = () => {
    setDeletedBooks(mockDb.getDeletedBooks());
  };

  const handleRestore = (id: string) => {
    mockDb.restoreBook(id);
    loadDeletedBooks();
    onRestoreSuccess(); // Signal parent to refresh main list
  };
  
  const handleRestoreAll = () => {
      mockDb.restoreAllBooks();
      loadDeletedBooks();
      onRestoreSuccess();
  }
  
  const handlePermanentDelete = (id: string) => {
      mockDb.permanentlyDeleteBook(id);
      loadDeletedBooks();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deleted Books" className="max-w-2xl">
      <div className="space-y-4">
        {deletedBooks.length > 0 && (
            <div className="flex justify-between items-center pb-2 border-b">
                <p className="text-sm text-muted-foreground">{deletedBooks.length} books in trash</p>
                <Button size="sm" onClick={handleRestoreAll} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <RotateCcw className="mr-2 h-3 w-3" />
                    Restore All
                </Button>
            </div>
        )}

        {deletedBooks.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/30">
               <Trash2 className="h-10 w-10 opacity-20 mb-2" />
               <p className="text-sm">No deleted books found</p>
           </div>
        ) : (
           <div className="grid gap-2 max-h-[60vh] overflow-y-auto pr-1">
             {deletedBooks.map(book => (
                <div key={book.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                    <div className="h-12 w-8 shrink-0 bg-muted rounded overflow-hidden">
                        <img src={book.coverUrl} className="h-full w-full object-cover opacity-60 grayscale" alt="" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <h4 className="font-medium text-sm truncate text-muted-foreground line-through decoration-muted-foreground/50">{book.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                         <Button size="sm" variant="outline" onClick={() => handleRestore(book.id)} className="h-8 text-xs bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200">
                            <RotateCcw className="mr-2 h-3 w-3" />
                            Restore
                         </Button>
                         <Button size="icon" variant="ghost" onClick={() => handlePermanentDelete(book.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                             <Trash2 className="h-3 w-3" />
                         </Button>
                    </div>
                </div>
             ))}
           </div>
        )}
        <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};