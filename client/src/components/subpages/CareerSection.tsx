// src/components/CareerSection.tsx

import React, { useRef, useState, useCallback, useMemo } from 'react';
// REMOVED: No longer need the emailjs library
// import emailjs from '@emailjs/browser'; 
import styles from './CareerSection.module.css';
import { Briefcase, Zap, Shield, FileText, UploadCloud, X, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Modal } from '../Modal'; 
import { NeuralAnimationWrapper} from '../background/career-connection/NeuralAnimationWrapper';


// --- HELPER: Format file size for display ---
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function CareerSection() {
  const { t } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const MAX_FILE_COUNT = 5;
  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const openModal = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    let newFiles = Array.from(files).filter(file => !selectedFiles.some(f => f.name === file.name));

    const validNewFiles: File[] = [];
    for (const file of newFiles) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        openModal('info', t('careers.modal.fileTypeTitle'), `${t('careers.modal.fileTypeMessage')} "${file.name}" ${t('careers.modal.fileTypeMessage2')}`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        openModal('info', t('careers.modal.fileSizeTitle'), `${t('careers.modal.fileSizeMessage')} "${file.name}" ${t('careers.modal.fileSizeMessage2')} ${MAX_FILE_SIZE_MB}MB ${t('careers.modal.fileSizeMessage3')}`);
        continue;
      }
      validNewFiles.push(file);
    }

    const updatedFiles = [...selectedFiles, ...validNewFiles];
    
    if (updatedFiles.length > MAX_FILE_COUNT) {
      openModal('info', t('careers.modal.limitTitle'), t('careers.modal.limitMessage'));
      setSelectedFiles(updatedFiles.slice(0, MAX_FILE_COUNT));
    } else {
      setSelectedFiles(updatedFiles);
    }
  }, [selectedFiles, t, openModal]);

  const removeFile = useCallback((fileToRemove: File) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  // --- *** THIS ENTIRE FUNCTION IS REPLACED *** ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || selectedFiles.length === 0) return;
    setIsSubmitting(true);

    // 1. Create a FormData object to hold all form fields and files
    const formData = new FormData(formRef.current);

    // 2. Append each selected file to the FormData object
    // The key 'attachments' must match the key used in the server's multer middleware
    selectedFiles.forEach(file => {
      formData.append('attachments', file);
    });

    try {
      // 3. Send the FormData to your new server endpoint
      const response = await fetch('http://localhost:3001/api/career-application', {
        method: 'POST',
        body: formData, 
        // NOTE: Do NOT set the 'Content-Type' header yourself.
        // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
      });

      const result = await response.json();

      if (!response.ok) {
        // If the server responded with an error, show it in the modal
        throw new Error(result.message || 'An unknown error occurred.');
      }

      // 4. Handle success
      openModal('success', t('careers.modal.successTitle'), result.message);
      formRef.current?.reset();
      setSelectedFiles([]);

    } catch (error: any) {
      // 5. Handle failure (network error or server error message)
      console.error('Submission failed:', error);
      openModal('error', t('careers.modal.errorTitle'), error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- *** END OF REPLACED FUNCTION *** ---

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    },
  };
  const cachyTextBlocks = useMemo(() => [
    { icon: Zap, titleKey: 'careers.block1.title', textKey: 'careers.block1.text' },
    { icon: Briefcase, titleKey: 'careers.block2.title', textKey: 'careers.block2.text' },
    { icon: Shield, titleKey: 'careers.block3.title', textKey: 'careers.block3.text' },
  ] as const, []);

  return (
    <NeuralAnimationWrapper>
      <section className={styles.careerSection}>
        {/* ... (rest of your JSX is the same) ... */}
        <div className={styles.headerContainer}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={containerVariants}>
            <motion.p variants={itemVariants} className={styles.preTitle}>{t('careers.preTitle')}</motion.p>
            <motion.h1 variants={itemVariants} className={styles.title}>{t('careers.title')}</motion.h1>
            <motion.p variants={itemVariants} className={styles.introText}>{t('careers.introText')}</motion.p>
          </motion.div>
        </div>

        <motion.div className={styles.cachyBlocks} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={containerVariants}>
          {cachyTextBlocks.map((block) => (
            <motion.div key={block.titleKey} className={styles.cachyBlock} variants={itemVariants}>
              <block.icon size={36} className={styles.cachyIcon} />
              <h3 className={styles.cachyTitle}>{t(block.titleKey)}</h3>
              <p className={styles.cachyText}>{t(block.textKey)}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.formSection}>
          <motion.h2 className={styles.formTitle} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
              {t('careers.form.heading')}
          </motion.h2>
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className={styles.formRow}>
              <div className={styles.formGroup}><label htmlFor="fullName">{t('careers.form.nameLabel')}</label><input type="text" id="fullName" name="fullName" required /></div>
              <div className={styles.formGroup}><label htmlFor="email">{t('careers.form.emailLabel')}</label><input type="email" id="email" name="email" required /></div>
            </div>
            <div className={styles.formGroup}><label htmlFor="position">{t('careers.form.positionLabel')}</label><input type="text" id="position" name="position" required /></div>
            <div className={styles.formGroup}><label htmlFor="coverLetter">{t('careers.form.coverLetterLabel')}</label><textarea id="coverLetter" name="coverLetter" rows={5} required /></div>

            <div className={styles.fileUploadGroup}>
              <p className={styles.fileUploadTitle}>
                <FileText size={20} /> {t('careers.form.fileTitle')}
              </p>
              <input 
                type="file" 
                id="attachments" 
                name="attachments" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                multiple 
                accept={ALLOWED_FILE_TYPES.join(',')} 
                disabled={selectedFiles.length >= MAX_FILE_COUNT} 
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className={styles.fileUploadButton} 
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedFiles.length >= MAX_FILE_COUNT}
              >
                <UploadCloud size={16} /> {t('careers.form.browseFiles')}
              </button>
              <span className={styles.fileInfoText}>
                  <br/>
                {`${t('careers.form.fileSupport')}: PDF, DOC, DOCX, JPG, PNG. ${t('careers.form.maxSize')} ${MAX_FILE_SIZE_MB}MB ${t('careers.form.perFile')}.`}
              </span>
              {selectedFiles.length > 0 && (
                <div className={styles.fileList}>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <div className={styles.fileDetails}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                      </div>
                      <button type="button" onClick={() => removeFile(file)} className={styles.removeFileButton}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting || selectedFiles.length === 0}>
              {isSubmitting ? (<span className={styles.sendingText}>{t('careers.form.sendingButton')}</span>) : (<>{t('careers.form.submitButton')}<Send size={18} className={styles.sendIcon}/></>)}
            </button>
          </form>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} type={modalType} title={modalTitle} message={modalMessage} />
      </section>
    </NeuralAnimationWrapper>
  );
}