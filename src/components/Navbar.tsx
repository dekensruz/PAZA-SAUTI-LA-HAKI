import React, { useEffect, useState } from 'react';
import { List, X, Moon, Sun } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/lib/theme';
import { brand } from '@/lib/media';

export const Logo: React.FC<{ light?: boolean; compact?: boolean }> = ({ light, compact }) => (
  <span className="flex items-center gap-3">
    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-sm ring-1 ring-ink/5 md:size-12">
      <img src={brand.logo} alt="" className="size-full object-contain" width={48} height={48} />
    </span>
    {!compact && (
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-semibold tracking-tight ${light ? 'text-white' : 'text-ink dark:text-white'}`}>Paza Sauti</span>
        <span className="mt-0.5 text-[0.7rem] font-extrabold uppercase tracking-[0.28em] text-paza-red">La Haki</span>
      </span>
    )}
  </span>
);

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  const items = [
    { label: t.nav.about, href: '/about' },
    { label: t.nav.mission, href: '/mission' },
    { label: t.nav.blog, href: '/blog' },
    { label: t.nav.gallery, href: '/gallery' },
    { label: t.nav.team, href: '/team' },
    { label: t.nav.faq, href: '/faq' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-ink dark:text-white' : 'text-slate-500 hover:text-ink dark:text-slate-400 dark:hover:text-white'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={`container-page flex h-16 items-center justify-between rounded-full transition-all duration-300 md:h-[4.5rem] ${
          scrolled || open
            ? 'border border-ink/5 bg-white/85 shadow-lg shadow-ink/5 backdrop-blur-xl dark:border-white/10 dark:bg-ink/80'
            : 'border border-transparent bg-transparent'
        }`}
      >
        <Link to="/" aria-label="Paza Sauti La Haki — accueil">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <NavLink key={item.href} to={item.href} className={linkClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && <motion.span layoutId="nav-dot" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-paza-red" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="flex h-10 items-center rounded-full px-3 text-xs font-extrabold tracking-wider text-ink transition hover:bg-ink/5 dark:text-white dark:hover:bg-white/10"
            aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            <span className={language === 'fr' ? '' : 'opacity-40'}>FR</span>
            <span className="mx-1 opacity-30">/</span>
            <span className={language === 'en' ? '' : 'opacity-40'}>EN</span>
          </button>
          <button
            onClick={toggle}
            className="flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-ink/5 dark:text-paza-yellow dark:hover:bg-white/10"
            aria-label="Thème clair / sombre"
          >
            {isDark ? <Sun size={19} weight="bold" /> : <Moon size={19} weight="bold" />}
          </button>
          <Link to="/contact" className="btn-primary ml-1 hidden !px-5 !py-2.5 sm:inline-flex">
            {t.nav.contact}
          </Link>
          <button
            className="flex size-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden dark:text-white dark:hover:bg-white/10"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="container-page mt-2 rounded-3xl border border-ink/5 bg-white/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-ink/95"
          >
            {[{ label: t.nav.home, href: '/' }, ...items, { label: t.nav.contact, href: '/contact' }].map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-xl font-medium ${
                    isActive ? 'bg-ink/5 text-ink dark:bg-white/10 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
