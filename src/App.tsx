// src/App.tsx (Updated)
import { LanguageProvider } from "./components/LanguageContext";
import { Header } from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Impact } from "./components/subpages/Impact";
import { Services } from "./components/subpages/Services";
import { Partnership } from "./components/subpages/Partnership";
import {AboutUs} from "./components/subpages/AboutUs";
import { Home } from "./components/Home"; // Import the new Home component
import { useState } from "react"; // Still needed for subpages' disclaimer
import { Footer } from "./components/Footer";
import { DisclaimerModal } from "./components/DisclaimerModal";
import ScrollToTop from './components/hooks/ScrollToTop'; // Import the new component
import { Funds } from "./components/subpages/Funds";
import { Contact } from "./components/subpages/Contact";
import { Career } from "./components/subpages/Career";


export default function App() {
  // Disclaimer state can be here if shared, but for now, duplicate for subpages (or use context)
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <LanguageProvider>
      <Router>
         <ScrollToTop />
        <Routes>
          {/* Home Route */}
          <Route path="/" element={
            <div className="min-h-screen">
              <Header  />
              <Home /> {/* Use the new Home component */}
            </div>
          } />



           {/* About Us Subpage Route */}
        <Route path="/about-us" element={
          <div className="min-h-screen">
            <Header />
            <AboutUs />
            <Footer />
            <DisclaimerModal 
              isOpen={isDisclaimerOpen} 
              onClose={() => setIsDisclaimerOpen(false)} 
            />
          </div>
        } />
            {/* Funds Subpage Route */}
        <Route path="/funds" element={
          <div className="min-h-screen">
            <Header />
            <Funds />
            <Footer />
            <DisclaimerModal 
              isOpen={isDisclaimerOpen} 
              onClose={() => setIsDisclaimerOpen(false)} 
            />
          </div>
        } />

              {/* Services Subpage Route */}
        <Route path="/services" element={
          <div className="min-h-screen">
            <Header />
            <Services />
            <Footer />
            <DisclaimerModal 
              isOpen={isDisclaimerOpen} 
              onClose={() => setIsDisclaimerOpen(false)} 
            />
          </div>
        } />
               {/* Partnership Subpage Route */}
        <Route path="/partnership" element={
          <div className="min-h-screen">
            <Header />
            <Partnership />
            <Footer />
            <DisclaimerModal 
              isOpen={isDisclaimerOpen} 
              onClose={() => setIsDisclaimerOpen(false)} 
            />
          </div>
        } />
                {/* Impact Subpage Route */}
        <Route path="/impact" element={
          <div className="min-h-screen">
            <Header />
            <Impact />
            <Footer />
            <DisclaimerModal 
              isOpen={isDisclaimerOpen} 
              onClose={() => setIsDisclaimerOpen(false)} 
            />
          </div>
        } />
         {/* Contact Subpage Route */}
        <Route path="/contact" element={
          <div className="min-h-screen">
            <Header />
            <Contact />
            <Footer  />
            <DisclaimerModal 
              isOpen={isDisclaimerOpen} 
              onClose={() => setIsDisclaimerOpen(false)} 
            />
          </div>
        } />

          {/* Contact Subpage Route */}
        <Route path="/careers" element={
          <div className="min-h-screen">
            <Header />
            <Career />
            <Footer  />
            <DisclaimerModal 
              isOpen={isDisclaimerOpen} 
              onClose={() => setIsDisclaimerOpen(false)} 
            />
          </div>
        } />


        </Routes>
      </Router>
    </LanguageProvider>
  );
}