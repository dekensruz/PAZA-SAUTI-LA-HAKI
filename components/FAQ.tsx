
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
             <HelpCircle className="text-paza-blue" size={28} />
             <h2 className="font-heading font-bold text-3xl md:text-4xl text-paza-dark dark:text-white">{t.faq.title}</h2>
          </div>
          <div className="w-20 h-1 bg-paza-blue mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {t.faq.items.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'shadow-md bg-slate-50 dark:bg-gray-800 border-paza-blue/30 dark:border-paza-blue/30' : 'bg-white dark:bg-gray-900 hover:border-paza-blue/30 dark:hover:border-gray-600'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className={`font-heading font-bold text-lg ${activeIndex === index ? 'text-paza-blue' : 'text-gray-800 dark:text-gray-200'}`}>
                  {faq.question}
                </span>
                <div className={`p-1 rounded-full flex-shrink-0 ml-4 transition-colors ${activeIndex === index ? 'bg-paza-blue text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
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
        </div>
      </div>
    </section>
  );
};

export default FAQ;
