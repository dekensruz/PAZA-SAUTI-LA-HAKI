import React, { Suspense, lazy, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Spinner } from '@/components/ui';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Mission from '@/sections/Mission';
import Gallery from '@/sections/Gallery';
import Team from '@/sections/Team';
import FAQ from '@/sections/FAQ';
import Blog from '@/sections/Blog';
import Contact from '@/sections/Contact';
import ArticlePage from '@/pages/ArticlePage';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { useSeo } from '@/lib/useSeo';

// L'espace d'administration (Quill, calendrier…) est chargé à la demande
const AdminApp = lazy(() => import('@/admin/AdminApp'));

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

// Page d'accueil : toutes les sections, avec défilement vers /about, /mission…
const MainPage = () => {
  const location = useLocation();
  const { t } = useLanguage();
  useSeo({ description: t.hero.description });

  useEffect(() => {
    if (location.pathname === '/') return;
    const element = document.getElementById(location.pathname.substring(1));
    if (element) {
      const timer = setTimeout(() => {
        const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <About />
      <Mission />
      <Gallery isPage={false} />
      <Team isPage={false} />
      <FAQ />
      <Blog isPage={false} />
      <Contact />
    </>
  );
};

const Page: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => {
  useSeo({ title, description });
  return <>{children}</>;
};

const SiteLayout = () => {
  const { isDark, toggle } = useTheme();
  return (
    <div className="min-h-screen font-sans transition-colors duration-300 flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white selection:bg-paza-blue selection:text-white">
      <Navbar isDarkMode={isDark} toggleTheme={toggle} />
      <main id="main" className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

const Pages = () => {
  const { t } = useLanguage();
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<MainPage />} />
        <Route path="/mission" element={<MainPage />} />
        <Route path="/faq" element={<MainPage />} />
        <Route path="/contact" element={<MainPage />} />
        <Route path="/gallery" element={<Page title={t.gallery.title} description={t.gallery.subtitle}><Gallery isPage /></Page>} />
        <Route path="/team" element={<Page title={t.team.title} description={t.team.subtitle}><Team isPage /></Page>} />
        <Route path="/blog" element={<Page title={t.nav.blog} description={t.blog.subtitle}><Blog isPage /></Page>} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="*" element={<MainPage />} />
      </Route>
      <Route
        path="/admin/*"
        element={
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center text-paza-blue">
                <Spinner className="size-8" />
              </div>
            }
          >
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  );
};

const App = () => (
  <MotionConfig reducedMotion="user">
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Pages />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </MotionConfig>
);

export default App;
