import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MicrophoneStage, Scales } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { brand } from '@/lib/media';

const ease = [0.22, 1, 0.36, 1] as const;

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden pt-28 md:pt-36">
      {/* Fond */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-paza-blue/10 blur-3xl dark:bg-paza-blue/20" />
        <div className="absolute top-1/2 left-[-15%] size-[30rem] rounded-full bg-paza-yellow/15 blur-3xl dark:bg-paza-yellow/5" />
        <div className="grain absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen" />
      </div>

      <div className="container-page grid items-center gap-14 pb-20 lg:grid-cols-12 lg:gap-10 lg:pb-28">
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mb-8 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-white/70 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-ink backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white">
            <span className="flex size-7 items-center justify-center rounded-full bg-ink text-paza-yellow dark:bg-white dark:text-ink">
              <Scales size={15} weight="fill" />
            </span>
            Goma · Nord-Kivu · RDC
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.05 }}
            className="font-display text-[3.4rem] leading-[0.95] font-semibold tracking-[-0.03em] text-ink sm:text-7xl lg:text-[6.2rem] dark:text-white"
          >
            {t.hero.titleStart}{' '}
            <span className="relative inline-block italic text-paza-blue">
              {t.hero.titleHighlight1}
              <svg className="absolute -bottom-2 left-0 w-full text-paza-yellow" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                <path d="M2 9C50 3 150 3 198 8" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            <br />
            {t.hero.titleMiddle} <span className="italic text-paza-red">{t.hero.titleHighlight2}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.2 }} className="mt-8 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-300">
            {t.hero.description}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.3 }} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/mission" className="btn-primary group !px-7 !py-4 text-base">
              {t.hero.ctaMission}
              <ArrowRight size={18} weight="bold" className="transition group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="btn-ghost !px-7 !py-4 text-base">
              <MicrophoneStage size={20} weight="duotone" />
              {t.hero.ctaJoin}
            </Link>
          </motion.div>
        </div>

        {/* Visuel */}
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease, delay: 0.15 }} className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-ink shadow-2xl shadow-ink/20">
            <img src={brand.formation} alt="Équipe Paza Sauti La Haki lors de la formation à Pole Institute" className="absolute inset-0 size-full object-cover opacity-90" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="font-display text-2xl leading-snug font-medium text-white md:text-3xl">« {t.hero.logoSubtitle} »</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-paza-yellow">{t.hero.logoTitle}</p>
            </div>
          </div>

          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-6 -left-4 flex size-28 items-center justify-center rounded-full bg-white p-3 shadow-xl ring-8 ring-paper md:-left-10 md:size-36 dark:ring-paper-dark">
            <img src={brand.logo} alt="Logo Paza Sauti La Haki" className="size-full object-contain" />
          </motion.div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute -right-3 bottom-24 flex items-center gap-2 rounded-2xl bg-white p-2.5 pr-4 shadow-xl md:-right-8 dark:bg-ink-soft">
            <img src={brand.flag} alt="Drapeau de la RDC" className="h-9 w-12 rounded-md object-cover" />
            <img src={brand.coatOfArms} alt="Armoiries de la RDC" className="size-9 object-contain" />
            <span className="text-xs leading-tight font-bold text-ink dark:text-white">
              Justice
              <br />
              Paix · Travail
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bandeau des domaines d'intervention */}
      <div className="relative border-y border-ink/10 bg-ink py-5 text-white dark:border-white/10">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...t.mission.domains, ...t.mission.domains, ...t.mission.domains, ...t.mission.domains].map((d, i) => (
            <span key={i} className="flex items-center gap-12 font-display text-xl font-medium italic md:text-2xl">
              {d}
              <span className={`size-2 rounded-full ${['bg-paza-blue', 'bg-paza-yellow', 'bg-paza-red'][i % 3]}`} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
