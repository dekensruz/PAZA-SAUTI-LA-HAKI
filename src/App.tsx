import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, Spinner } from '@/components/ui';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { ThemeProvider } from '@/lib/theme';
import HomePage from '@/pages/HomePage';
import BlogPage from '@/pages/BlogPage';
import ArticlePage from '@/pages/ArticlePage';
import NotFound from '@/pages/NotFound';
import Gallery from '@/sections/Gallery';
import Team from '@/sections/Team';
import { useSeo } from '@/lib/useSeo';
import { useLanguage } from '@/i18n/LanguageContext';

// L'espace d'administration (Quill, calendrier…) est chargé à la demande
const AdminApp = lazy(() => import('@/admin/AdminApp'));

const HOME_SECTIONS = ['/', '/about', '/mission', '/faq', '/contact'];

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!HOME_SECTIONS.includes(pathname) || pathname === '/') window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const SiteLayout: React.FC = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <BackToTop />
  </div>
);

const GalleryPage: React.FC = () => {
  const { t } = useLanguage();
  useSeo({ title: t.gallery.title, description: t.gallery.subtitle });
  return <Gallery isPage />;
};

const TeamPage: React.FC = () => {
  const { t } = useLanguage();
  useSeo({ title: t.team.title, description: t.team.subtitle });
  return <Team isPage />;
};

const Loader = () => (
  <div className="flex min-h-screen items-center justify-center text-paza-blue">
    <Spinner className="size-8" />
  </div>
);

const App: React.FC = () => (
  <ThemeProvider>
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            {HOME_SECTIONS.map((p) => (
              <Route key={p} path={p} element={<HomePage />} />
            ))}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<ArticlePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<Loader />}>
                <AdminApp />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
