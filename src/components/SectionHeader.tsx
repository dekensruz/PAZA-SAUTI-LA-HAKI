import React from 'react';
import { motion } from 'framer-motion';
import type { Icon } from '@tabler/icons-react';

type Accent = 'blue' | 'red' | 'yellow';

const accents: Record<Accent, { text: string; bar: string; chip: string }> = {
  blue: { text: 'text-paza-blue', bar: 'bg-paza-blue', chip: 'bg-paza-blue/10 text-paza-blue dark:bg-paza-blue/20' },
  red: { text: 'text-paza-red', bar: 'bg-paza-red', chip: 'bg-paza-red/10 text-paza-red dark:bg-paza-red/20 dark:text-red-400' },
  yellow: { text: 'text-yellow-600 dark:text-paza-yellow', bar: 'bg-paza-yellow', chip: 'bg-paza-yellow/20 text-yellow-700 dark:text-paza-yellow' },
};

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: Icon;
  accent?: Accent;
  align?: 'center' | 'left';
  /** Élément affiché à droite (ex. bouton « voir tout ») quand align = left */
  action?: React.ReactNode;
  as?: 'h1' | 'h2';
}

/** En-tête de section unifié : même hiérarchie visuelle partout sur le site. */
const SectionHeader: React.FC<Props> = ({ eyebrow, title, subtitle, icon: IconCmp, accent = 'blue', align = 'center', action, as: Tag = 'h2' }) => {
  const a = accents[accent];
  const centered = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={`mb-12 md:mb-16 flex flex-col gap-6 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}
    >
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <span className={`inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest ${a.chip}`}>
            {IconCmp && <IconCmp size={16} stroke={1.6} />}
            {eyebrow}
          </span>
        )}
        <Tag className="font-heading font-bold text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight text-paza-dark dark:text-white text-balance">{title}</Tag>
        <div className={`w-20 h-1 ${a.bar} rounded-full mt-4 ${centered ? 'mx-auto' : ''}`} />
        {subtitle && <p className={`mt-5 text-gray-600 dark:text-gray-300 text-lg leading-relaxed text-pretty ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
};

export default SectionHeader;

/** Bouton secondaire « voir tout » commun aux sections. */
export const ViewAllClass = (accent: Accent = 'blue') =>
  `group inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm border-2 transition-all hover:-translate-y-0.5 ${
    accent === 'red'
      ? 'border-paza-red text-paza-red hover:bg-paza-red hover:text-white'
      : accent === 'yellow'
        ? 'border-yellow-500 text-yellow-700 hover:bg-paza-yellow hover:text-paza-dark dark:text-paza-yellow'
        : 'border-paza-blue text-paza-blue hover:bg-paza-blue hover:text-white'
  } bg-white dark:bg-gray-900`;
