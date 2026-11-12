import React, { useState } from 'react';
import { Check, Copy, FacebookLogo, LinkedinLogo, ShareNetwork, WhatsappLogo, XLogo } from '@phosphor-icons/react';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  url: string;
  title: string;
  summary?: string;
  variant?: 'row' | 'compact';
}

const ShareMenu: React.FC<Props> = ({ url, title, summary, variant = 'row' }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const targets = [
    { label: t.blog.shareWhatsApp, icon: WhatsappLogo, href: `https://api.whatsapp.com/send?text=${enc(`${title} — ${url}`)}`, cls: 'hover:bg-[#25D366]' },
    { label: t.blog.shareFacebook, icon: FacebookLogo, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, cls: 'hover:bg-[#1877F2]' },
    { label: t.blog.shareX, icon: XLogo, href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, cls: 'hover:bg-black' },
    { label: t.blog.shareLinkedIn, icon: LinkedinLogo, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, cls: 'hover:bg-[#0A66C2]' },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers refusé */
    }
  };

  const nativeShare = () => navigator.share?.({ title, text: summary, url }).catch(() => {});
  const btn = 'flex size-11 items-center justify-center rounded-full border border-ink/10 text-ink transition hover:border-transparent hover:text-white dark:border-white/15 dark:text-white';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${variant === 'compact' ? '' : ''}`}>
      {variant === 'row' && <span className="mr-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{t.blog.share}</span>}
      {targets.map(({ label, icon: Icon, href, cls }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={`${btn} ${cls}`}>
          <Icon size={18} weight="fill" />
        </a>
      ))}
      <button onClick={copy} aria-label={t.blog.copyLink} title={t.blog.copyLink} className={`${btn} hover:bg-ink dark:hover:bg-white dark:hover:text-ink`}>
        {copied ? <Check size={18} weight="bold" className="text-emerald-500" /> : <Copy size={18} weight="bold" />}
      </button>
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button onClick={nativeShare} aria-label={t.blog.share} className={`${btn} hover:bg-paza-blue sm:hidden`}>
          <ShareNetwork size={18} weight="bold" />
        </button>
      )}
      {copied && <span className="text-xs font-semibold text-emerald-600">{t.blog.copied}</span>}
    </div>
  );
};

export default ShareMenu;
