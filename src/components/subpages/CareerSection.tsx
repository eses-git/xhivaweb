// src/components/CareerSection.tsx

import React, { useRef, useState, useCallback, useMemo } from 'react';
import emailjs from '@emailjs/browser';
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

  // --- MODIFIED handleFiles function with console.log for debugging ---
const handleFiles = useCallback((files: FileList | null) => {
  console.log("--- handleFiles triggered ---");
  if (!files) {
    console.log("No files received.");
    return;
  }
  
  console.log(`Received ${files.length} file(s) from input.`);

  let newFiles = Array.from(files).filter(file => !selectedFiles.some(f => f.name === file.name));

  if (newFiles.length === 0 && files.length > 0) {
    console.log("All files were filtered out as duplicates.");
  }

  // NEW: Collect valid files in a separate array to avoid mutation during iteration
  const validNewFiles: File[] = [];
  for (const file of newFiles) {
    console.log(`Validating file: ${file.name}`);
    console.log(` -> File type: ${file.type}`);
    console.log(` -> File size: ${file.size} bytes`);

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.error(` -> VALIDATION FAILED: Type '${file.type}' is not allowed.`);
      openModal(
        'info', 
        t('careers.modal.fileTypeTitle'), 
        `${t('careers.modal.fileTypeMessage')} "${file.name}" ${t('careers.modal.fileTypeMessage2')}`
      );
      continue;  // Skip this file, but don't mutate the original array
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      console.error(` -> VALIDATION FAILED: Size ${file.size} is over the ${MAX_FILE_SIZE_MB}MB limit.`);
      openModal(
        'info', 
        t('careers.modal.fileSizeTitle'), 
        `${t('careers.modal.fileSizeMessage')} "${file.name}" ${t('careers.modal.fileSizeMessage2')} ${MAX_FILE_SIZE_MB}MB ${t('careers.modal.fileSizeMessage3')}`
      );
      continue;  // Skip this file
    }

    // If valid, add to validNewFiles
    validNewFiles.push(file);
  }

  const updatedFiles = [...selectedFiles, ...validNewFiles];
  console.log(`Attempting to set state with ${updatedFiles.length} total file(s).`);
  
  if (updatedFiles.length > MAX_FILE_COUNT) {
    console.warn(`File count exceeds limit of ${MAX_FILE_COUNT}. Slicing array.`);
    openModal('info', t('careers.modal.limitTitle'), t('careers.modal.limitMessage'));
    setSelectedFiles(updatedFiles.slice(0, MAX_FILE_COUNT));
  } else {
    setSelectedFiles(updatedFiles);
  }
  console.log("--- handleFiles finished ---");
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
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formRef.current) return;
  setIsSubmitting(true);

  const formData = new FormData(formRef.current);
  const templateParams: Record<string, any> = {};
  for (const pair of formData.entries()) { templateParams[pair[0]] = pair[1]; }

  // Add timestamp for testing
  templateParams['date'] = new Date().toLocaleString();

  if (selectedFiles.length > 0) {
    const filePromises = selectedFiles.map(file => {
      return new Promise<[string, string]>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataURL = reader.result as string;
          const base64 = dataURL.split(',')[1]; // Strip prefix
          // NEW: Validate base64 (quick check)
          try {
            atob(base64.substring(0, 100)); // Test first 100 chars
            resolve([file.name, base64]);
          } catch (err) {
            console.error(`Base64 validation failed for ${file.name}:`, err);
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const fileData = await Promise.all(filePromises);
      fileData.forEach(([fileName, base64], index) => {
        templateParams[`file_name_${index + 1}`] = fileName;
        templateParams[`file_data_${index + 1}`] = base64;
        // Optional: Add MIME for better attachment handling
        templateParams[`file_mime_${index + 1}`] = selectedFiles[index].type || 'application/octet-stream';
      });
      // NO PADDING: Only include params for existing files
    } catch (fileError) {
      console.error('File processing failed:', fileError);
      // Optionally: Proceed without files or show error modal
      setIsSubmitting(false);
      return; // Stop submission if files corrupt
    }
  }

  console.log('Template params being sent:', templateParams); // DEBUG: Check in console

  try {
    await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_CAREER_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    openModal('success', t('careers.modal.successTitle'), t('careers.modal.successMessage'));
    formRef.current?.reset();
    setSelectedFiles([]);
  } catch (error) {
    console.error('EmailJS full error:', error); // Always log for details
    openModal('error', t('careers.modal.errorTitle'), t('careers.modal.errorMessage'));
  } finally {
    setIsSubmitting(false);
  }
};

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