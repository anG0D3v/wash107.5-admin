// Modal.tsx
import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  actions: Array<{
    label: string;
    color: 'primary' | 'secondary';
    onClick: () => void;
  }>;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, title, content, actions }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {actions.map((action, index) => (
          <Button key={index} onClick={action.onClick} color={action.color}>
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
