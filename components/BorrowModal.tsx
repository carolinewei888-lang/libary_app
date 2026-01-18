import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Book } from '../types';
import { Calendar, AlertTriangle, BookOpenCheck } from 'lucide-react';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  book: Book | null;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({ isOpen, onClose, onConfirm, book }) => {
  if (!book) return null;

  // Calculate Due Date (14 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const formattedDate = dueDate.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Checkout">
      <div className="space-y-6">
        <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border">
            <div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-muted">
                <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
            </div>
            <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium text-foreground">Return by: {formattedDate}</p>
                    <p className="text-muted-foreground">You have 14 days to enjoy this book.</p>
                </div>
            </div>

            <div className="flex items-start gap-3 text-sm p-3 rounded bg-amber-50 border border-amber-100 text-amber-900">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium">Late Fee Policy</p>
                    <p className="opacity-90 mt-1">
                        Please return the book on time. A fine of 
                        <span className="font-bold"> $1.50 per day </span> 
                        will be applied for overdue returns.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={onConfirm} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <BookOpenCheck className="mr-2 h-4 w-4" />
                Confirm & Borrow
            </Button>
        </div>
      </div>
    </Modal>
  );
};