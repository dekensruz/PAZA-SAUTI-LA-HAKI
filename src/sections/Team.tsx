import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { teamMembers } from '@/data/team';
import { Img, Reveal, SectionHeading } from '@/components/ui';

const Team: React.FC<{ isPage?: boolean }> = ({ isPage = false }) => {
  const { t } = useLanguage();
  const members = isPage ? teamMembers : teamMembers.slice(0, 4);

  return (
    <section id="team" className={`scroll-mt-24 bg-white py-24 md:py-32 dark:bg-ink/40 ${isPage ? 'pt-36 md:pt-44' : ''}`}>
      <div className="container-page">
        <SectionHeading
          eyebrow={t.nav.team}
          title={isPage ? t.team.fullPageTitle : t.team.title}
          subtitle={t.team.subtitle}
          action={
            !isPage && (
              <Link to="/team" className="btn-ghost group shrink-0">
                {t.team.viewAll} <ArrowRight size={16} weight="bold" className="transition group-hover:translate-x-1" />
              </Link>
            )
          }
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={(i % 4) * 0.06}>
              <figure className="group">
                <div className="relative overflow-hidden rounded-3xl">
                  <Img src={m.image} alt={m.name} wrapperClassName="aspect-[4/5]" className="size-full object-cover grayscale-[35%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                  <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-paza-blue via-paza-yellow to-paza-red transition-transform duration-500 group-hover:scale-x-100" />
                </div>
                <figcaption className="mt-4">
                  <p className="font-display text-lg leading-snug font-semibold text-ink md:text-xl dark:text-white">{m.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{t.team.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        {isPage && <p className="mt-16 text-center font-display text-2xl text-slate-500 italic">{t.team.quote}</p>}
      </div>
    </section>
  );
};

export default Team;
