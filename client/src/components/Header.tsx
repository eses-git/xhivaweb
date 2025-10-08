// Header.tsx
import { Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { Link } from "react-router-dom"; // Ensure Link is imported for routing
import logo from './assets/tri-logo-tr.png'; // Assuming you have a logo image
import styles from './Header.module.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
   /* { name: t('nav.investment'), href: "/Investment" },*/
    { name: t('nav.home'), href: "/" },
    { name: t('nav.about'), href: "/about-us" },
    { name: t('nav.funds'), href: "/funds" },
    { name: t('nav.services'), href: "/services" },
    { name: t('nav.partnerships'), href: "/partnership" },
    { name: t('nav.impact'), href: "/impact" },
    { name: t('nav.careers'), href: "/careers" },
    { name: t('nav.contact'), href: "/contact" }
 /*   { name: t('nav.protocol'), href: "/protocol" },*/

  ];

  return (
    <header className={styles.header} id="main-header">
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          {/* Logo and Company Name - Wrapped in Link to home */}
          <Link to="/" className={styles.logoLink}> {/* ADDED: Wrap in Link to "/" */}
            <div className={styles.logoSection}>
              <img src={logo} alt="XHIVA Logo" className={styles.logo} />
              <span className={styles.companyName}>
                XHIVA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={styles.navLink}
              >
                {item.name}
                <span className={styles.navUnderline}></span>
              </a>
            ))}
            
            {/* Language Switcher (Desktop) */}
            <div className={styles.languageSwitcher}>
              <Globe className={styles.globeIcon} />
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className={styles.languageButton}
              >
                {language === 'en' ? 'ES' : 'EN'}
              </button>
            </div>
            
          </nav>

          {/* Mobile Right Section: Language Switcher + Menu Button */}
          <div className={styles.mobileRightSection}>
            {/* Language Switcher (Mobile) */}
            <div className={styles.mobileLanguageSwitcher}>
              <Globe className={styles.globeIcon} />
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className={styles.languageButton}
              >
                {language === 'en' ? 'ES' : 'EN'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className={styles.menuIcon} />
              ) : (
                <Menu className={styles.menuIcon} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={styles.mobileNav}>
            <nav className={styles.mobileNavList}>
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}