import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "./LanguageContext";
import { Link } from "react-router-dom";
import logo from './assets/tri-logo-tr.png';
import styles from './Header.module.css';
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavTooLong, setIsNavTooLong] = useState(false);
  const { t } = useLanguage();
  const navRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.about'), href: "/about-us" },
    { name: t('nav.funds'), href: "/funds" },
    { name: t('nav.services'), href: "/services" },
    { name: t('nav.tax'), href: "/strategic-tax-architecture" },
    { name: t('nav.partnerships'), href: "/partnership" },
    { name: t('nav.impact'), href: "/impact" },
    { name: t('nav.careers'), href: "/careers" },
    { name: t('nav.contact'), href: "/contact" },
  ];

  useEffect(() => {
    const checkNavWidth = () => {
      if (navRef.current) {
        const navWidth = navRef.current.offsetWidth;
        const containerWidth = navRef.current.parentElement?.offsetWidth || 0;
        setIsNavTooLong(navWidth > containerWidth * 0.6); // Threshold for "too long"
      }
    };
    checkNavWidth();
    window.addEventListener('resize', checkNavWidth);
    return () => window.removeEventListener('resize', checkNavWidth);
  }, [t]); // Re-run when translations change

  return (
    <header className={styles.header} id="main-header">
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          {/* Logo and Company Name - Wrapped in Link to home */}
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logoSection}>
              <img 
                src={logo} 
                alt="XHIVA Logo" 
                className={styles.logo} 
                width={50}  
                height={50} 
              />
              <span className={styles.companyName}>
                XHIVA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav ref={navRef} className={styles.desktopNav}>
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
            {!isNavTooLong && (
              <div className={styles.languageSwitcher}>
                <LanguageSwitcher />
              </div>
            )}
          </nav>

          {/* Top-Right Language Switcher for Long Nav */}
          {isNavTooLong && (
            <div className={styles.topRightLanguageSwitcher}>
              <LanguageSwitcher />
            </div>
          )}

          {/* Mobile Right Section: Language Switcher + Menu Button */}
          <div className={styles.mobileRightSection}>
            {!isNavTooLong && (
              <div className={styles.mobileLanguageSwitcher}>
                <LanguageSwitcher />
              </div>
            )}
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