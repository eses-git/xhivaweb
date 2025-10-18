// src/App.tsx (Updated)

import { LanguageProvider } from "./components/LanguageContext";
import { Header } from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Impact } from "./components/subpages/Impact";
import { Services } from "./components/subpages/Services";
import { Partnership } from "./components/subpages/Partnership";
import { AboutUs } from "./components/subpages/AboutUs";
import { Home } from "./components/Home";
import { useState, useEffect } from "react";
import { Footer } from "./components/Footer";
import ScrollToTop from './components/hooks/ScrollToTop.tsx';
import { Funds } from "./components/subpages/Funds";
import { Contact } from "./components/subpages/Contact";
import { Career } from "./components/subpages/Career";
import {Tax} from "./components/subpages/Tax.tsx";

// --- SEO, Consent & Policy Imports ---
import { HelmetProvider } from 'react-helmet-async';
import CookieBanner from "./components/CookieBanner.tsx";
import GoogleAnalytics from "./components/GoogleAnalytics"; // Not currently in use
import PageLayout from "./components/PageLayout";
import { CookiePolicy } from "./components/CookiePolicy.tsx";

type ConsentStatus = 'pending' | 'accepted' | 'declined';

export default function App() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  // 1. ADD NEW LOADING STATE
  const [isConsentLoaded, setIsConsentLoaded] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsentStatus') as ConsentStatus | null;
    if (savedConsent) {
      setConsentStatus(savedConsent);
    } else {
      setConsentStatus('pending');
    }
    // 2. SET LOADING TO TRUE AFTER CHECK IS COMPLETE
    setIsConsentLoaded(true);
  }, []);

  const handleAcceptCookies = (): void => {
    setConsentStatus('accepted');
    localStorage.setItem('cookieConsentStatus', 'accepted');
  };

  const handleDeclineCookies = (): void => {
    setConsentStatus('declined');
    localStorage.setItem('cookieConsentStatus', 'declined');
  };

  // 3. RENDER A BLANK SCREEN OR LOADER WHILE CONSENT IS LOADING
  if (!isConsentLoaded) {
    // You can return a loading spinner here if needed, 
    // but returning null prevents the flash.
    return null; 
  }


  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          {/* We are NOT using GoogleAnalytics for now, so it remains commented out */}
     {consentStatus === 'accepted' && <GoogleAnalytics />}
          <ScrollToTop />
          <Routes>
            {/* Home Route */}
            <Route path="/" element={
              <PageLayout 
                title="Architecting the World of Tomorrow"
                description="Xhiva deploys strategic capital into the disruptive technologies, critical infrastructure, and sustainable initiatives that will define the next century."
              >
                <div className="min-h-screen">
                  <Header />
                  <Home />
                </div>
              </PageLayout>
            } />

            {/* About Us Subpage Route */}
            <Route path="/about-us" element={
              <PageLayout
                title="About Us"
                description="A premier strategic advisory firm at the nexus of sovereign interests, central banking, and private capital markets. Discover our philosophy of stewardship."
              >
                <div className="min-h-screen">
                  <Header />
                  <AboutUs />
                  <Footer />
                </div>
              </PageLayout>
            } />
            
            {/* Funds Subpage Route */}
            <Route path="/funds" element={
              <PageLayout
                title="Our Global Funds"
                description="A curated portfolio of specialized investment vehicles engineered to capitalize on distinct global megatrends, from disruptive technology to sovereign infrastructure."
              >
                <div className="min-h-screen">
                  <Header />
                  <Funds />
                  <Footer />
                </div>
              </PageLayout>
            } />

            {/* Services Subpage Route */}
            <Route path="/services" element={
              <PageLayout
                title="Institutional Services"
                description="Explore our integrated suite of financial services, including asset management, custom portfolio construction, wealth planning, and fiduciary services for institutions."
              >
                <div className="min-h-screen">
                  <Header />
                  <Services />
                  <Footer />
                </div>
              </PageLayout>
            } />

            {/* Partnership Subpage Route */}
            <Route path="/partnership" element={
              <PageLayout
                title="Global Partnership Network"
                description="We forge powerful partnerships with sovereign wealth funds, institutional investors, and global banks to amplify impact and create synergistic value."
              >
                <div className="min-h-screen">
                  <Header />
                  <Partnership />
                  <Footer />
                </div>
              </PageLayout>
            } />

            {/* Impact Subpage Route */}
            <Route path="/impact" element={
              <PageLayout
                title="Our Impact"
                description="Our investment mandate extends beyond profit to foster long-term stability and progress, reinforcing economic foundations and enabling humanitarian advancement."
              >
                <div className="min-h-screen">
                  <Header />
                  <Impact />
                  <Footer />
                </div>
              </PageLayout>
            } />

            {/* Contact Subpage Route */}
            <Route path="/contact" element={
              <PageLayout
                title="Contact Us"
                description="Connect with Xhiva. We are available for new engagements and inquiries from qualified institutional investors and partners."
              >
                <div className="min-h-screen">
                  <Header />
                  <Contact />
                  <Footer />
                </div>
              </PageLayout>
            } />

            {/* Careers Subpage Route */}
            <Route path="/careers" element={
              <PageLayout
                title="Careers"
                description="Explore career opportunities with an industry leader. We are committed to attracting and developing top talent to drive innovation in the global financial sector."
              >
                <div className="min-h-screen">
                  <Header />
                  <Career />
                  <Footer />
                </div>
              </PageLayout>
            } />
            {/* Strategic Tax Architecture & Legacy Structuring Subpage Route */}
        <Route path="/strategic-tax-architecture" element={
            <PageLayout
              title="Strategic Tax Architecture & Legacy Structuring"
              description="Pioneering bespoke, multi-jurisdictional frameworks to foster enduring capital growth and orchestrate intergenerational wealth transfer through robust, globally defensible structures."
            >
              <div className="min-h-screen">
                <Header />
                <Tax /> {/* Your new component is rendered here */}
                <Footer />
              </div>
            </PageLayout>
          } />

            {/* COOKIE POLICY ROUTE */}
            <Route path="/cookie-policy" element={<CookiePolicy />} />

          </Routes>
          
          {/* Banner is only shown if consentStatus is 'pending' */}
          {consentStatus === 'pending' && (
            <CookieBanner 
              onAccept={handleAcceptCookies} 
              onDecline={handleDeclineCookies} 
            />
          )}
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}