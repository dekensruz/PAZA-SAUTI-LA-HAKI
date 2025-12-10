
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Gallery from './components/Gallery';
import Team from './components/Team';
import FAQ from './components/FAQ';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Partners from './components/Partners';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { LanguageProvider } from './LanguageContext';

// Composant qui gère l'affichage unique et le scroll automatique
const MainPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Si on est à la racine, on remonte tout en haut
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Sinon on cherche l'ID correspondant à l'URL (ex: /mission -> id="mission")
    const sectionId = location.pathname.substring(1); // enlève le "/"
    const element = document.getElementById(sectionId);
    
    if (element) {
      // Petit délai pour s'assurer que le rendu est prêt
      setTimeout(() => {
        const headerOffset = 80; // Hauteur de la navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Partners />
      <Mission />
      <Gallery />
      <Team />
      <FAQ />
      <Blog />
      <Contact />
    </>
  );
};

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <BrowserRouter>
      <div className={`min-h-screen font-sans transition-colors duration-300 flex flex-col ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'} selection:bg-paza-blue selection:text-white`}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-grow pt-20">
          <Routes>
            {/* Toutes les routes pointent vers MainPage qui gère le scroll */}
            <Route path="/" element={<MainPage />} />
            <Route path="/about" element={<MainPage />} />
            <Route path="/mission" element={<MainPage />} />
            <Route path="/gallery" element={<MainPage />} />
            <Route path="/team" element={<MainPage />} />
            <Route path="/faq" element={<MainPage />} />
            <Route path="/blog" element={<MainPage />} />
            <Route path="/contact" element={<MainPage />} />
            {/* Fallback pour n'importe quelle autre URL */}
            <Route path="*" element={<MainPage />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
