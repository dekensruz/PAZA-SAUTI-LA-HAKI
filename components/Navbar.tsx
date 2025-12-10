
import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Globe } from 'lucide-react';
import { NavItem } from '../types';
import { useLanguage } from '../LanguageContext';
import { NavLink, Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.mission, href: '/mission' },
    { label: t.nav.gallery, href: '/gallery' },
    { label: t.nav.team, href: '/team' },
    { label: t.nav.faq, href: '/faq' },
    { label: t.nav.blog, href: '/blog' },
    { label: t.nav.contact, href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-white dark:bg-gray-900 py-4 shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link 
          to="/" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="bg-white rounded-full p-1 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
            <img 
              src="https://i.ibb.co/5gCvZcKM/Logo.png" 
              alt="Paza Sauti La Haki Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-paza-dark dark:text-white text-lg md:text-xl tracking-tight leading-none">
              PAZA SAUTI
            </span>
            <span className="font-heading font-bold text-paza-red text-base md:text-lg tracking-tight leading-none">
              LA HAKI
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) => 
                `font-medium transition-colors duration-200 text-sm uppercase tracking-wide cursor-pointer ${
                  isActive 
                    ? 'text-paza-blue font-bold border-b-2 border-paza-blue pb-1' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-paza-blue dark:hover:text-paza-blue'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          
          <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-700 pl-4 ml-2">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-paza-dark dark:text-white font-bold text-sm flex items-center gap-1"
              aria-label="Switch Language"
            >
              <Globe size={18} />
              {language.toUpperCase()}
            </button>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-paza-dark dark:text-yellow-400"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
           <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-paza-dark dark:text-white font-bold text-sm flex items-center gap-1"
            >
              {language.toUpperCase()}
            </button>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-paza-dark dark:text-yellow-400"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="text-paza-dark dark:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 absolute w-full shadow-lg h-screen overflow-y-auto pb-20">
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `font-semibold block cursor-pointer py-2 ${
                    isActive 
                      ? 'text-paza-blue pl-2 border-l-4 border-paza-blue' 
                      : 'text-gray-800 dark:text-gray-200 hover:text-paza-blue dark:hover:text-paza-blue'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;