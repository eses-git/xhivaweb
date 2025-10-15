import React from 'react';
import { Helmet } from 'react-helmet-async';

// Read the Measurement ID using Vite's import.meta.env syntax
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const GoogleAnalytics = () => {
  // Only render the script if the ID is available
  if (!GA_MEASUREMENT_ID) {
    console.warn("Google Analytics Measurement ID is not defined in the .env file. Make sure it's named VITE_GA_MEASUREMENT_ID.");
    return null;
  }

  return (
    <Helmet>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      ></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;
