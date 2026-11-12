import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Mission from '@/sections/Mission';
import Gallery from '@/sections/Gallery';
import Team from '@/sections/Team';
import FAQ from '@/sections/FAQ';
import LatestArticles from '@/sections/LatestArticles';
import Contact from '@/sections/Contact';
import { useSeo } from '@/lib/useSeo';
import { useLanguage } from '@/i18n/LanguageContext';

/** Accueil ; /about, /mission, /faq, /contact défilent jusqu'à la section correspondante. */
const HomePage: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  useSeo({ description: t.hero.description });

  useEffect(() => {
    const id = pathname.slice(1);
    if (!id) return;
    const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <Hero />
      <About />
      <Mission />
      <LatestArticles />
      <Gallery />
      <Team />
      <FAQ />
      <Contact />
    </>
  );
};

export default HomePage;
