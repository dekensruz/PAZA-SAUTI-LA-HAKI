import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { brand } from '@/lib/media';
import { Img, Reveal } from '@/components/ui';

const partners = ['Pole Institute', 'International Alert', 'I-Peace'];

const About: React.FC = () => {
  const { t } = useLanguage();
  const [first, ...rest] = t.about.description.split(/(?<=\.)\s+/);

  return (
    <section id="about" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-6">
          <div className="relative">
            <Img src={brand.formation} alt="Formation à l'Université Alternative de Pole Institute" wrapperClassName="aspect-[5/4] rounded-[2rem]" className="size-full object-cover" />
            <div className="absolute -right-4 -bottom-8 max-w-[15rem] rounded-3xl bg-paza-yellow p-6 text-ink shadow-xl md:-right-8">
              <p className="font-display text-4xl font-semibold">3</p>
              <p className="mt-1 text-sm leading-snug font-semibold">
                {t.about.subtitle}
                <br />
                <span className="font-medium opacity-80">{partners.join(' · ')}</span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6">
          <span className="eyebrow mb-5">{t.about.subtitle}</span>
          <h2 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-ink md:text-6xl dark:text-white">{t.about.title}</h2>
          <p className="mt-8 font-display text-2xl leading-snug font-medium text-ink md:text-[1.7rem] dark:text-white">{first}</p>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{rest.join(' ')}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {partners.map((p) => (
              <span key={p} className="rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink dark:border-white/15 dark:text-white">
                {p}
              </span>
            ))}
          </div>
          <Link to="/mission" className="btn-primary group mt-10">
            {t.hero.ctaMission}
            <ArrowRight size={18} weight="bold" className="transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default About;
