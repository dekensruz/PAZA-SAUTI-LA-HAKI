
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPlus as Plus, IconMinus as Minus, IconHelpCircle as Question } from '@tabler/icons-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { IconMessages as ChatsCircle } from '@tabler/icons-react';
import SectionHeader from '@/components/SectionHeader';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const { t } = useLanguage();

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="FAQ" title={t.faq.title} subtitle={t.faq.subtitle} icon={Question} accent="blue" />

        <div className="max-w-3xl mx-auto space-y-4">
          {t.faq.items.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'shadow-md bg-slate-50 dark:bg-gray-800 border-paza-blue/30 dark:border-paza-blue/30' : 'bg-white dark:bg-gray-900 hover:border-paza-blue/30 dark:hover:border-gray-600'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-paza-blue rounded-xl"
                aria-expanded={activeIndex === index}
              >
                <span className={`font-heading font-bold text-lg ${activeIndex === index ? 'text-paza-blue' : 'text-gray-800 dark:text-gray-200'}`}>
                  {faq.question}
                </span>
                <div className={`p-1 rounded-full flex-shrink-0 ml-4 transition-colors ${activeIndex === index ? 'bg-paza-blue text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                  {activeIndex === index ? <Minus size={20} stroke={2.2} /> : <Plus size={20} stroke={2.2} />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100/50 dark:border-gray-700/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-paza-blue/5 dark:bg-paza-blue/10 border border-paza-blue/15 p-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <ChatsCircle size={36} stroke={1.6} className="text-paza-blue shrink-0 hidden sm:block" />
              <div>
                <p className="font-heading font-bold text-paza-dark dark:text-white">{t.faq.moreTitle}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.faq.moreText}</p>
              </div>
            </div>
            <Link to="/contact" className="shrink-0 px-6 py-3 rounded-full bg-paza-blue text-white font-bold text-sm hover:bg-paza-blue-dark transition-colors">
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
