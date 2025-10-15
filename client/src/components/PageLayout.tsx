import React from 'react';
import SEO from './SEO';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  keywords?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, description, keywords }) => {
  return (
    <>
      <SEO title={title} description={description} keywords={keywords} />
      {children}
    </>
  );
};

export default PageLayout;
