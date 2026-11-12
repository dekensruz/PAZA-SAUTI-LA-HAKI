import React from 'react';
import { Phone, MapPin, Envelope, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Logo } from './Navbar';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const links = [
    { label: t.nav.about, href: '/about' },
    { label: t.nav.mission, href: '/mission' },
    { label: t.nav.blog, href: '/blog' },
    { label: t.nav.gallery, href: '/gallery' },
    { label: t.nav.team, href: '/team' },
    { label: t.nav.faq, href: '/faq' },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-x-0 top-0 flex h-1">
        <span className="flex-1 bg-paza-blue" />
        <span className="flex-1 bg-paza-yellow" />
        <span className="flex-1 bg-paza-red" />
      </div>
      <div className="container-page pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo light />
            <p className="mt-6 max-w-sm leading-relaxed text-slate-400">{t.footer.description}</p>
            <p className="mt-8 font-display text-3xl leading-tight font-medium text-white md:text-4xl">
              {t.hero.titleStart} <em className="text-paza-yellow">{t.hero.titleHighlight1}</em> {t.hero.titleMiddle}{' '}
              <em className="text-paza-red">{t.hero.titleHighlight2}</em>.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{t.footer.quickLinks}</h4>
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="group inline-flex items-center gap-1 text-slate-300 transition hover:text-white">
                    {l.label}
                    <ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{t.footer.contactUs}</h4>
            <ul className="space-y-4 text-slate-300">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 shrink-0 text-paza-red" size={20} weight="duotone" />
                <span>
                  Goma, Nord-Kivu
                  <br />
                  République Démocratique du Congo
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="shrink-0 text-paza-red" size={20} weight="duotone" />
                <a href="tel:+243977812672" className="hover:text-white">+243 977 812 672</a>
              </li>
              <li className="flex gap-3">
                <Envelope className="shrink-0 text-paza-red" size={20} weight="duotone" />
                <a href="mailto:info@pazasautilahaki.org" className="break-all hover:text-white">info@pazasautilahaki.org</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Paza Sauti La Haki. {t.footer.rights}</p>
          <p>
            {t.footer.developedBy}{' '}
            <a href="https://portfoliodek.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-300 hover:text-white">
              Dekens Ruzuba
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
