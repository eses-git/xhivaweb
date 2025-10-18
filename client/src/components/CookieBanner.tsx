// src/components/CookieBanner.tsx (Updated)
import React from 'react';
import { useLanguage } from './LanguageContext';
import './CookieBanner.css'; // We'll update this CSS slightly

interface CookieBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept , onDecline }) => {
  const { t } = useLanguage();

  return (
    <div className="cookie-banner">
      <p>
        {t('cookieBanner.message')}
          <a href="/cookie-policy"> {t('cookieBanner.policyLinkText')}</a>
      </p>
      <div className="cookie-banner-buttons">
        <button onClick={onDecline} className="decline-button">
          {t('cookieBanner.declineButton')}
        </button>
        <button onClick={onAccept} className="accept-button">
          {t('cookieBanner.acceptButton')}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;