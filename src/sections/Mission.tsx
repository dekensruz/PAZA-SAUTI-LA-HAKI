import React from 'react';
import { BookOpenText, Compass, HandFist, Scales, Handshake, ShieldCheck, UsersThree, HeartHalf, Leaf, Eye, Target } from '@phosphor-icons/react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Reveal, SectionHeading } from '@/components/ui';

const pillarIcons = [BookOpenText, Compass, HandFist];
const valueIcons = [Scales, ShieldCheck, UsersThree, HeartHalf];
const domainIcons = [Scales, Handshake, HeartHalf, Leaf];
const accents = ['text-paza-blue', 'text-paza-red', 'text-amber-500', 'text-emerald-600'];

const Mission: React.FC = () => {
  const { t } = useLanguage();
  const m = t.mission;

  return (
    <section id="mission" className="scroll-mt-24 bg-white py-24 md:py-32 dark:bg-ink/40">
      <div className="container-page">
        {/* Vision & Mission */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink p-10 text-white md:p-14">
            <Eye size={36} weight="duotone" className="text-paza-yellow" />
            <h2 className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{m.visionTitle}</h2>
            <p className="mt-4 font-display text-3xl leading-tight font-medium md:text-4xl">{m.visionText}</p>
            <div className="absolute -right-16 -bottom-16 size-56 rounded-full bg-paza-blue/30 blur-3xl" />
          </Reveal>
          <Reveal delay={0.1} className="rounded-[2rem] border border-ink/10 p-10 md:p-14 dark:border-white/10">
            <Target size={36} weight="duotone" className="text-paza-red" />
            <h2 className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">{m.missionTitle}</h2>
            <p className="mt-4 font-display text-3xl leading-tight font-medium text-ink md:text-4xl dark:text-white">{m.missionText}</p>
          </Reveal>
        </div>

        {/* Piliers */}
        <div className="mt-24">
          <SectionHeading eyebrow={m.missionTitle} title={m.missionSubtitle} />
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-ink/10 bg-ink/10 md:grid-cols-3 dark:border-white/10 dark:bg-white/10">
            {m.missionPillars.map((p, i) => {
              const Icon = pillarIcons[i];
              return (
                <Reveal key={p.title} delay={i * 0.08} className="group bg-paper p-8 transition-colors hover:bg-white md:p-10 dark:bg-paper-dark dark:hover:bg-ink-soft">
                  <div className="flex items-start justify-between">
                    <Icon size={40} weight="duotone" className={accents[i]} />
                    <span className="font-display text-5xl font-semibold text-ink/10 dark:text-white/10">0{i + 1}</span>
                  </div>
                  <h3 className="mt-10 font-display text-2xl font-semibold text-ink dark:text-white">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">{p.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Valeurs & domaines */}
        <div className="mt-24 grid gap-16 lg:grid-cols-2">
          <div>
            <span className="eyebrow mb-4">{m.valuesTitle}</span>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink dark:text-white">{m.valuesTitle}</h2>
            <ul className="mt-10 divide-y divide-ink/10 dark:divide-white/10">
              {m.values.map((v, i) => {
                const Icon = valueIcons[i];
                return (
                  <Reveal key={v.title} delay={i * 0.05}>
                    <li className="flex gap-5 py-6">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-paza-yellow/20 text-amber-700 dark:text-paza-yellow">
                        <Icon size={24} weight="duotone" />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-ink dark:text-white">{v.title}</h3>
                        <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">{v.text}</p>
                      </div>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <div>
            <span className="eyebrow mb-4">{m.domainsTitle}</span>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink dark:text-white">{m.domainsTitle}</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {m.domains.map((d, i) => {
                const Icon = domainIcons[i];
                return (
                  <Reveal key={d} delay={i * 0.06} className="group flex min-h-44 flex-col justify-between rounded-3xl border border-ink/10 p-6 transition hover:-translate-y-1 hover:border-transparent hover:bg-ink hover:text-white dark:border-white/10 dark:hover:bg-white dark:hover:text-ink">
                    <Icon size={32} weight="duotone" className={`${accents[i]} transition group-hover:text-paza-yellow dark:group-hover:text-paza-blue`} />
                    <h3 className="font-display text-xl leading-snug font-semibold">{d}</h3>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
