
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, Gavel, Users, Leaf } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Mission: React.FC = () => {
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const icons = [Gavel, Users, ShieldCheck, HeartHandshake, Leaf];
  const iconColors = [
    "bg-blue-100 dark:bg-blue-900/50 text-paza-blue",
    "bg-red-100 dark:bg-red-900/50 text-paza-red",
    "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400",
    "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
    "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
  ];

  return (
    <section id="mission" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-paza-dark dark:text-white mb-4">{t.mission.title}</h2>
          <div className="w-20 h-1 bg-paza-blue mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.mission.subtitle}
          </p>
        </div>

        {/* Changed from grid to flex wrap to center the 5th item nicely */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {t.mission.cards.map((card, index) => {
                const Icon = icons[index];
                return (
                    <motion.div 
                        key={index}
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="bg-slate-50 dark:bg-gray-800 p-6 rounded-xl border border-slate-100 dark:border-gray-700 hover:shadow-lg transition-all w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] flex flex-col"
                    >
                        <div className={`w-12 h-12 ${iconColors[index]} rounded-lg flex items-center justify-center mb-4`}>
                            <Icon size={24} />
                        </div>
                        <h3 className="font-heading font-bold text-xl mb-3 text-gray-800 dark:text-white">{card.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">{card.text}</p>
                    </motion.div>
                );
            })}
        </div>
      </div>
    </section>
  );
};

export default Mission;
