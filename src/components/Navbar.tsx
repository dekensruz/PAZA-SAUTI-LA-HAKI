import { brand } from '@/lib/media';
import React, { useState, useEffect } from 'react';
import { IconMenu2 as List, IconX as X, IconMoon as Moon, IconSun as Sun, IconLanguage as Translate, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const HOME_ROUTES = ['/', '/about', '/mission', '/faq', '/contact'];
const SECTION_IDS = ['home', 'about', 'mission', 'gallery', 'team', 'faq', 'blog', 'contact'];

/** Section visible à l'écran (page d'accueil) pour surligner le bon lien du menu. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState('home');
  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => {
      const y = window.scrollY + 140;
      let current = 'home';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);
  return active;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { pathname } = useLocation();
  const onHome = HOME_ROUTES.includes(pathname);
  const activeSection = useActiveSection(onHome);

  const navItems = [
    { label: t.nav.home, href: '/', id: 'home' },
    { label: t.nav.about, href: '/about', id: 'about' },
    { label: t.nav.mission, href: '/mission', id: 'mission' },
    { label: t.nav.gallery, href: '/gallery', id: 'gallery' },
    { label: t.nav.team, href: '/team', id: 'team' },
    { label: t.nav.faq, href: '/faq', id: 'faq' },
    { label: t.nav.blog, href: '/blog', id: 'blog' },
  ];

  const isActive = (item: (typeof navItems)[number]) =>
    onHome ? activeSection === item.id : item.href !== '/' && pathname.startsWith(item.href);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu mobile à chaque navigation et bloque le défilement quand il est ouvert
  useEffect(() => setIsMobileMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleLanguage = () => setLanguage(language === 'fr' ? 'en' : 'fr');

  const iconBtn = 'p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-paza-dark dark:text-white';

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-paza-blue focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        {language === 'fr' ? 'Aller au contenu' : 'Skip to content'}
      </a>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md py-2' : 'bg-white dark:bg-gray-900 py-3 md:py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Paza Sauti La Haki — accueil">
            <div className={`bg-white rounded-full p-1 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isScrolled ? 'w-11 h-11 md:w-12 md:h-12' : 'w-12 h-12 md:w-14 md:h-14'}`}>
              <img src={brand.logo} alt="" className="w-full h-full object-contain" width={56} height={56} />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-paza-dark dark:text-white text-lg md:text-xl tracking-tight leading-none">PAZA SAUTI</span>
              <span className="font-heading font-bold text-paza-red text-base md:text-lg tracking-tight leading-none">LA HAKI</span>
            </div>
          </Link>

          {/* Menu ordinateur */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive(item) ? 'page' : undefined}
                className={`relative px-3 py-2 rounded-full font-semibold text-[0.8rem] xl:text-sm uppercase tracking-wide transition-colors ${
                  isActive(item) ? 'text-paza-blue' : 'text-gray-600 dark:text-gray-300 hover:text-paza-blue dark:hover:text-paza-blue'
                }`}
              >
                {item.label}
                {isActive(item) && <motion.span layoutId="nav-underline" className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-paza-blue" />}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button onClick={toggleLanguage} className={`${iconBtn} font-bold text-sm flex items-center gap-1.5`} aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}>
              <Translate size={18} stroke={1.6} className="hidden sm:block" />
              {language.toUpperCase()}
            </button>
            <button onClick={toggleTheme} className={`${iconBtn} dark:text-yellow-400`} aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}>
              {isDarkMode ? <Sun size={20} stroke={1.6} /> : <Moon size={20} stroke={1.6} />}
            </button>
            <Link
              to="/contact"
              className="hidden md:inline-flex ml-2 items-center gap-2 px-5 py-2.5 rounded-full bg-paza-blue text-white text-sm font-bold shadow-md shadow-paza-blue/25 hover:bg-paza-blue-dark hover:-translate-y-0.5 transition-all"
            >
              {t.nav.contact}
            </Link>
            <button
              className="lg:hidden p-2.5 rounded-full text-paza-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} stroke={2.2} /> : <List size={24} stroke={2.2} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full inset-x-0 h-[calc(100dvh-100%)] overflow-y-auto bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col">
                {[...navItems, { label: t.nav.contact, href: '/contact', id: 'contact' }].map((item, i) => (
                  <motion.div key={item.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 font-heading font-bold text-lg ${
                        isActive(item) ? 'text-paza-blue' : 'text-gray-800 dark:text-gray-100'
                      }`}
                    >
                      {item.label}
                      <ArrowRight size={18} stroke={2.2} className={isActive(item) ? 'text-paza-blue' : 'text-gray-300 dark:text-gray-600'} />
                    </Link>
                  </motion.div>
                ))}
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-6 w-full text-center px-6 py-4 rounded-full bg-paza-blue text-white font-bold">
                  {t.hero.ctaJoin}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
