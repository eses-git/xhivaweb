// src/components/FaqSection.tsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import styles from './Faq.module.css';
import { useLanguage } from '../LanguageContext';

// --- Types for our Data Structure ---
type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqCategory = {
  id: string;
  title: string;
  questions: FaqItem[];
};

export function FaqSection() {
  const { t } = useLanguage();
  
  // Input State: Captures what the user types immediately
  const [inputValue, setInputValue] = useState('');
  
  // Search State: The actual term used to filter the list (set only on button click/enter)
  const [searchTerm, setSearchTerm] = useState('');
  
  // Accordion State: Tracks which question IDs are currently open
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Helper to construct data from translations
  const categories: FaqCategory[] = useMemo(() => [
    {
      id: 'cat1',
      title: t('faq.cat1.title'),
      questions: [
        { id: 'c1q1', question: t('faq.cat1.q1.question'), answer: t('faq.cat1.q1.answer') },
        { id: 'c1q2', question: t('faq.cat1.q2.question'), answer: t('faq.cat1.q2.answer') },
        { id: 'c1q3', question: t('faq.cat1.q3.question'), answer: t('faq.cat1.q3.answer') },
        { id: 'c1q4', question: t('faq.cat1.q4.question'), answer: t('faq.cat1.q4.answer') },
        { id: 'c1q5', question: t('faq.cat1.q5.question'), answer: t('faq.cat1.q5.answer') },
      ]
    },
    {
      id: 'cat2',
      title: t('faq.cat2.title'),
      questions: [
        { id: 'c2q1', question: t('faq.cat2.q1.question'), answer: t('faq.cat2.q1.answer') },
        { id: 'c2q2', question: t('faq.cat2.q2.question'), answer: t('faq.cat2.q2.answer') },
        { id: 'c2q3', question: t('faq.cat2.q3.question'), answer: t('faq.cat2.q3.answer') },
        { id: 'c2q4', question: t('faq.cat2.q4.question'), answer: t('faq.cat2.q4.answer') },
        { id: 'c2q5', question: t('faq.cat2.q5.question'), answer: t('faq.cat2.q5.answer') },
      ]
    },
    {
      id: 'cat3',
      title: t('faq.cat3.title'),
      questions: [
        { id: 'c3q1', question: t('faq.cat3.q1.question'), answer: t('faq.cat3.q1.answer') },
        { id: 'c3q2', question: t('faq.cat3.q2.question'), answer: t('faq.cat3.q2.answer') },
        { id: 'c3q3', question: t('faq.cat3.q3.question'), answer: t('faq.cat3.q3.answer') },
        { id: 'c3q4', question: t('faq.cat3.q4.question'), answer: t('faq.cat3.q4.answer') },
        { id: 'c3q5', question: t('faq.cat3.q5.question'), answer: t('faq.cat3.q5.answer') },
      ]
    },
    {
      id: 'cat4',
      title: t('faq.cat4.title'),
      questions: [
        { id: 'c4q1', question: t('faq.cat4.q1.question'), answer: t('faq.cat4.q1.answer') },
        { id: 'c4q2', question: t('faq.cat4.q2.question'), answer: t('faq.cat4.q2.answer') },
        { id: 'c4q3', question: t('faq.cat4.q3.question'), answer: t('faq.cat4.q3.answer') },
        { id: 'c4q4', question: t('faq.cat4.q4.question'), answer: t('faq.cat4.q4.answer') },
      ]
    },
    {
      id: 'cat5',
      title: t('faq.cat5.title'),
      questions: [
        { id: 'c5q1', question: t('faq.cat5.q1.question'), answer: t('faq.cat5.q1.answer') },
      ]
    },
  ], [t]);

  // --- Search Handler ---
  // Triggered by button click or Enter key
  const handleSearch = () => {
    setSearchTerm(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // --- Filtering Logic ---
  const filteredCategories = useMemo(() => {
    // If no active search term, return all
    if (!searchTerm.trim()) return categories;

    const lowerTerm = searchTerm.toLowerCase();

    return categories.map(cat => {
      // Check if questions match (search both question and answer)
      const matchingQuestions = cat.questions.filter(
        q => q.question.toLowerCase().includes(lowerTerm) || 
             q.answer.toLowerCase().includes(lowerTerm)
      );

      return {
        ...cat,
        questions: matchingQuestions
      };
    }).filter(cat => cat.questions.length > 0); // Remove empty categories

  }, [categories, searchTerm]);

  // --- Auto-Expand Effect ---
  useEffect(() => {
    if (searchTerm.trim() !== '') {
      const newOpenItems: Record<string, boolean> = {};
      filteredCategories.forEach(cat => {
        cat.questions.forEach(q => {
          newOpenItems[q.id] = true;
        });
      });
      setOpenItems(newOpenItems);
    } else {
      setOpenItems({});
    }
  }, [searchTerm, filteredCategories]);


  // --- Accordion Toggle ---
  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.preTitle}>{t('faq.header.preTitle')}</span>
          <h1 className={styles.mainTitle}>{t('faq.header.mainTitle')}</h1>
          <p className={styles.subtitle}>{t('faq.header.subtitle')}</p>
        </div>

        {/* SEARCH BAR */}
        <div className={styles.searchWrapper}>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder={t('faq.search.placeholder')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className={styles.searchIcon} 
            onClick={handleSearch}
            aria-label="Search"
            style={{ 
              border: 'none', 
              background: 'transparent', 
              cursor: 'pointer',
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Simple SVG Search Icon (Magnifying Glass) */}
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* CATEGORIES & QUESTIONS */}
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <div key={category.id} className={styles.faqCategory}>
              <h2 className={styles.categoryTitle}>{category.title}</h2>
              
              {category.questions.map(q => (
                <AccordionItem 
                  key={q.id} 
                  item={q} 
                  isOpen={!!openItems[q.id]} 
                  onToggle={() => toggleItem(q.id)} 
                />
              ))}
            </div>
          ))
        ) : (
          // No Results State
          <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
            <p>No results found for "{searchTerm}"</p>
          </div>
        )}

      </div>
    </section>
  );
}

// --- Helper Component for Smooth Animation ---
function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem, isOpen: boolean, onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.active : ''}`}>
      <button 
        className={styles.accordionButton} 
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.questionText}>{item.question}</span>
        <span className={styles.icon}>+</span>
      </button>
      
      <div 
        className={styles.accordionContent}
        ref={contentRef}
        style={{ 
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px'
        }}
      >
        <div className={styles.answerText}>
          {item.answer}
        </div>
      </div>
    </div>
  );
}