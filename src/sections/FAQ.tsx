import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow mb-4">FAQ</span>
            <h2 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-ink md:text-5xl dark:text-white">{t.faq.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{t.faq.subtitle}</p>
            <Link to="/contact" className="btn-primary mt-8">
              {t.contact.title}
            </Link>
          </div>
        </div>
        <div className="divide-y divide-ink/10 border-y border-ink/10 lg:col-span-8 dark:divide-white/10 dark:border-white/10">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.question}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-start gap-6 py-7 text-left" aria-expanded={isOpen}>
                  <span className="mt-1 font-mono text-sm text-slate-400">0{i + 1}</span>
                  <span className="flex-1 font-display text-xl leading-snug font-semibold text-ink md:text-2xl dark:text-white">{item.question}</span>
                  <span className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border transition ${isOpen ? 'rotate-45 border-paza-red bg-paza-red text-white' : 'border-ink/15 text-ink dark:border-white/20 dark:text-white'}`}>
                    <Plus size={16} weight="bold" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="pb-8 pl-12 text-lg leading-relaxed text-slate-600 md:pr-16 dark:text-slate-400">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
