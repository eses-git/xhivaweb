import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  // Use a template for the title to always include your brand name
  const pageTitle = `${title} | Xhiva`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph Tags for social sharing */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;

