// Modal.tsx
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  content: React.ReactNode;
  actions: Array<{
    label: string;
    color: 'primary' | 'secondary';
    onClick: () => void;
  }>;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, title, content, actions }) => {
  return (
    <Dialog 
    open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {actions.map((action, index) => (
          <button
           className='normal-case bg-blue-500 mb-4 mr-6 text-white font-semibold py-2 px-4 rounded-[3px] shadow-md transition duration-300 ease-in-out transform hover:scale-105'
            key={index} onClick={action.onClick}>
            {action.label}
          </button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
