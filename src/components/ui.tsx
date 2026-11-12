import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from '@phosphor-icons/react';

export const SectionHeading: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  action?: React.ReactNode;
}> = ({ eyebrow, title, subtitle, align = 'left', action }) => (
  <div className={`mb-12 flex flex-col gap-6 md:mb-16 ${align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
    <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      <h2 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-ink md:text-5xl dark:text-white">{title}</h2>
      {subtitle && <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/** Image avec fondu à l'apparition et fond de chargement. */
export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { wrapperClassName?: string }> = ({
  wrapperClassName = '',
  className = '',
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`block overflow-hidden bg-slate-200/70 dark:bg-white/5 ${loaded ? '' : 'animate-pulse'} ${wrapperClassName}`}>
      <img
        loading="lazy"
        decoding="async"
        {...props}
        onLoad={(e) => {
          setLoaded(true);
          props.onLoad?.(e);
        }}
        className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </span>
  );
};

export const Spinner: React.FC<{ className?: string }> = ({ className = 'size-6' }) => (
  <span className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} role="status" />
);

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Haut de page"
      className={`fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full bg-ink text-white shadow-xl transition-all duration-300 hover:bg-paza-blue dark:bg-white dark:text-ink ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp size={20} weight="bold" />
    </button>
  );
};

export const ErrorNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-2xl border border-paza-red/20 bg-paza-red/5 px-5 py-4 text-sm text-paza-red">{children}</div>
);
