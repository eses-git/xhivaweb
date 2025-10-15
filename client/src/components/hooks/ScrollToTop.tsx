import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import React from 'react'; // Import React for FC type

// Define the component as a React Functional Component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;