import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { AlertTriangle, Trash2, Ban } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  variant: 'danger' | 'warning'; // 'danger' for delete confirmation, 'warning' for blocking action
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, onClose, onConfirm, title, description, variant 
}) => {
  const isWarning = variant === 'warning';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isWarning ? "Action Not Allowed" : "Confirm Deletion"}>
      <div className="space-y-6">
        <div className={`flex items-start gap-4 p-4 rounded-lg border ${isWarning ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
           <div className={`p-2 rounded-full shrink-0 ${isWarning ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
             {isWarning ? <Ban className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
           </div>
           <div>
             <h3 className={`font-semibold text-sm ${isWarning ? 'text-amber-900' : 'text-red-900'}`}>
                {title}
             </h3>
             <p className={`text-sm mt-1 whitespace-pre-line ${isWarning ? 'text-amber-800/80' : 'text-red-800/80'}`}>
                {description}
             </p>
           </div>
        </div>

        <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
                {isWarning ? "Close" : "Cancel"}
            </Button>
            {!isWarning && onConfirm && (
                <Button variant="destructive" onClick={onConfirm}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Yes, Delete
                </Button>
            )}
        </div>
      </div>
    </Modal>
  );
};