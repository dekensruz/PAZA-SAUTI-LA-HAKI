
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Scale, Mic } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[calc(100vh-80px)] flex items-center justify-center pt-8 pb-12 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-paza-blue/10 dark:bg-paza-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-paza-red/10 dark:bg-paza-red/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm mb-6">
            <span className="w-2 h-2 bg-paza-red rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t.hero.badge}</span>
          </div>
          
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-paza-dark dark:text-white mb-6 leading-tight">
            {t.hero.titleStart} <span className="text-transparent bg-clip-text bg-gradient-to-r from-paza-blue to-blue-600 dark:from-blue-400 dark:to-blue-600">{t.hero.titleHighlight1}</span> {t.hero.titleMiddle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-paza-red to-red-600 dark:from-red-400 dark:to-red-600">{t.hero.titleHighlight2}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/mission" 
              className="px-8 py-3 bg-paza-blue text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scale size={20} />
              {t.hero.ctaMission}
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-white dark:bg-gray-800 text-paza-dark dark:text-white border border-gray-200 dark:border-gray-700 font-bold rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mic size={20} />
              {t.hero.ctaJoin}
            </Link>
          </div>
        </motion.div>

        {/* Visual Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative order-1 lg:order-2 flex justify-center"
        >
          <div className="relative w-full aspect-square max-w-sm md:max-w-md">
            {/* Using a placeholder for Goma/Justice concept */}
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden rotate-3 transform transition-transform hover:rotate-0 duration-500 border border-gray-100 dark:border-gray-700">
                <img 
                  src="https://images.pexels.com/photos/9685285/pexels-photo-9685285.jpeg" 
                  alt="Justice background" 
                  className="w-full h-full object-cover opacity-10 dark:opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center flex-col p-8">
                   <img 
                      src="https://i.ibb.co/5gCvZcKM/Logo.png" 
                      alt="Logo PSLH"
                      className="w-32 h-32 md:w-48 md:h-48 object-contain mb-6 drop-shadow-md"
                   />
                   <h3 className="text-xl md:text-2xl font-heading font-bold text-paza-dark dark:text-white text-center">{t.hero.logoTitle}</h3>
                   <p className="text-gray-500 dark:text-gray-400 mt-2 text-center text-sm md:text-base">{t.hero.logoSubtitle}</p>
                </div>
            </div>
            
            {/* Decorative elements representing DRC */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-16 h-16 md:w-24 md:h-24 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg rotate-12 z-20 border border-gray-100 dark:border-gray-700">
              <img src="https://i.ibb.co/RWPHrYS/rdc-flag.png" alt="Drapeau RDC" className="w-full h-full object-contain rounded" />
            </div>
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-16 h-16 md:w-24 md:h-24 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg -rotate-12 z-20 border border-gray-100 dark:border-gray-700">
              <img src="https://i.ibb.co/23Rwc5Hj/armoirie.png" alt="Armoirie RDC" className="w-full h-full object-contain rounded" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
