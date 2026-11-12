import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSeo } from '@/lib/useSeo';

const NotFound: React.FC = () => {
  const { t } = useLanguage();
  useSeo({ title: t.footer.notFoundTitle });
  return (
    <section className="container-page flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <p className="font-display text-[8rem] leading-none font-semibold text-ink/10 md:text-[12rem] dark:text-white/10">404</p>
      <h1 className="-mt-6 font-display text-4xl font-semibold text-ink dark:text-white">{t.footer.notFoundTitle}</h1>
      <p className="mt-4 max-w-md text-slate-600 dark:text-slate-400">{t.footer.notFoundText}</p>
      <Link to="/" className="btn-primary mt-10">{t.footer.backHome}</Link>
    </section>
  );
};

export default NotFound;
