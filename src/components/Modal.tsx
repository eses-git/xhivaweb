// src/components/Modal.tsx
import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import { CheckCircle, XCircle } from 'lucide-react'; // Assuming you have lucide-react icons

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'info';
  message: string;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, type, message, title }) => {
  if (!isOpen) return null;

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const icon =
    type === 'success' ? (
      <CheckCircle size={48} className={styles.successIcon} />
    ) : type === 'error' ? (
      <XCircle size={48} className={styles.errorIcon} />
    ) : null; // You can add an info icon if needed

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles[type]}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalHeader}>
          {icon}
          <h2 className={styles.modalTitle}>{title}</h2>
        </div>
        <p className={styles.modalMessage}>{message}</p>
        <button className={styles.actionButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};