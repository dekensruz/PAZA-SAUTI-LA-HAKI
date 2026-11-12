import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconMessageCircle as ChatCircle, IconCheck as Check, IconCopy as Copy, IconBrandFacebook as FacebookLogo, IconBrandLinkedin as LinkedinLogo, IconShare as ShareNetwork, IconBrandX as TwitterLogo } from '@tabler/icons-react';
import { useLanguage } from '@/i18n/LanguageContext';

type Platform = 'whatsapp' | 'facebook' | 'twitter' | 'linkedin';

export function shareTo(platform: Platform, url: string, title: string) {
  const text = encodeURIComponent(`${title} - Paza Sauti La Haki`);
  const u = encodeURIComponent(url);
  const target = {
    whatsapp: `https://api.whatsapp.com/send?text=${text}%20${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  }[platform];
  window.open(target, '_blank', 'noopener,noreferrer');
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (url: string) =>
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  return { copied, copy };
}

/** Bouton « partager » + menu déroulant (cartes d'articles), comme sur la version d'origine. */
export const ShareDropdown: React.FC<{ url: string; title: string; summary?: string }> = ({ url, title, summary }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { copied, copy } = useCopy();

  const onShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) navigator.share({ title, text: summary, url }).catch(() => {});
    else setOpen((o) => !o);
  };

  const item = 'w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-gray-700 dark:text-gray-300 transition-colors';
  const act = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  return (
    <div className="relative">
      <button onClick={onShare} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-paza-blue hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all flex items-center justify-center border border-gray-100 dark:border-gray-800" title={t.blog.share}>
        <ShareNetwork size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={act(() => setOpen(false))} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 bottom-12 z-20 w-52 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl p-2 flex flex-col gap-1 text-sm font-medium"
            >
              <button onClick={act(() => copy(url))} className={`${item} hover:bg-gray-100 dark:hover:bg-gray-800`}>
                {copied ? (
                  <>
                    <Check stroke={2.2} size={16} className="text-green-500" />
                    <span className="text-green-500 text-xs">{t.blog.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>{t.blog.copyLink}</span>
                  </>
                )}
              </button>
              <button onClick={act(() => shareTo('whatsapp', url, title))} className={`${item} hover:bg-green-500/10 hover:text-green-600`}>
                <ChatCircle size={16} className="text-green-500" /> <span>WhatsApp</span>
              </button>
              <button onClick={act(() => shareTo('facebook', url, title))} className={`${item} hover:bg-blue-600/10 hover:text-blue-700`}>
                <FacebookLogo size={16} className="text-blue-600" /> <span>Facebook</span>
              </button>
              <button onClick={act(() => shareTo('twitter', url, title))} className={`${item} hover:bg-black/10 dark:hover:bg-white/10`}>
                <TwitterLogo size={16} className="text-black dark:text-white" /> <span>X / Twitter</span>
              </button>
              <button onClick={act(() => shareTo('linkedin', url, title))} className={`${item} hover:bg-blue-700/10 hover:text-blue-800`}>
                <LinkedinLogo size={16} className="text-blue-700" /> <span>LinkedIn</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Barre de partage (page article), reprise du style de l'ancienne fenêtre d'article. */
export const ShareBar: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const { t } = useLanguage();
  const { copied, copy } = useCopy();
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{t.blog.share}</span>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => copy(url)} className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-all flex items-center gap-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:scale-[1.03] border border-gray-100 dark:border-gray-800">
          {copied ? (
            <>
              <Check stroke={2.2} size={16} className="text-green-500" />
              <span className="text-green-500 font-bold">{t.blog.copied}</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>{t.blog.copyLink}</span>
            </>
          )}
        </button>
        <button onClick={() => shareTo('whatsapp', url, title)} className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/40 dark:text-green-400 rounded-xl transition-all hover:scale-[1.05]" title="WhatsApp">
          <ChatCircle size={18} />
        </button>
        <button onClick={() => shareTo('facebook', url, title)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 dark:text-blue-400 rounded-xl transition-all hover:scale-[1.05]" title="Facebook">
          <FacebookLogo size={18} />
        </button>
        <button onClick={() => shareTo('twitter', url, title)} className="p-2.5 bg-gray-50 text-black hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white rounded-xl transition-all hover:scale-[1.05]" title="X / Twitter">
          <TwitterLogo size={18} />
        </button>
        <button onClick={() => shareTo('linkedin', url, title)} className="p-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 dark:text-blue-400 rounded-xl transition-all hover:scale-[1.05]" title="LinkedIn">
          <LinkedinLogo size={18} />
        </button>
      </div>
    </div>
  );
};
