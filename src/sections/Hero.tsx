
import { brand } from '@/lib/media';
import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight as ArrowRight, IconMicrophone as MicrophoneStage, IconChevronDown as CaretDown } from '@tabler/icons-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[calc(100svh-80px)] flex items-center justify-center pt-10 pb-20 md:pt-8 md:pb-16 overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-paza-blue/5 dark:bg-paza-blue/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-paza-red/5 dark:bg-paza-red/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left order-1 lg:col-span-7"
        >
          <h1 className="font-heading font-extrabold text-[2.6rem] sm:text-6xl lg:text-7xl text-paza-dark dark:text-white mb-6 leading-[1.08] tracking-tight text-balance">
            {t.hero.titleStart} <span className="text-transparent bg-clip-text bg-gradient-to-r from-paza-blue to-blue-500">{t.hero.titleHighlight1}</span> {t.hero.titleMiddle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-paza-red to-red-500">{t.hero.titleHighlight2}</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium text-pretty">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/mission" 
              className="group px-8 py-4 bg-paza-dark dark:bg-white text-white dark:text-paza-dark font-bold rounded-full hover:bg-paza-blue dark:hover:bg-paza-blue dark:hover:text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer"
            >
              {t.hero.ctaMission}
              <ArrowRight size={20} stroke={2.2} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-transparent text-paza-dark dark:text-white border-2 border-gray-200 dark:border-gray-700 font-bold rounded-full hover:border-paza-dark dark:hover:border-white transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <MicrophoneStage size={24} stroke={1.6} />
              {t.hero.ctaJoin}
            </Link>
          </div>
        </motion.div>

        {/* Visual Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative order-2 lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative w-full aspect-[4/5] max-w-[17rem] sm:max-w-sm md:max-w-md">
            
            {/* Main Aesthetic Card */}
            <div className="absolute inset-0 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-center p-8 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-paza-blue/5 to-paza-red/5"></div>
                <img 
                  src={brand.hero} 
                  alt="Justice abstract" 
                  className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000"
                />
                
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center mb-8 border border-gray-50 dark:border-gray-800">
                     <img 
                        src={brand.logo} 
                        alt="Logo PSLH"
                        className="w-24 h-24 md:w-32 md:h-32 object-contain"
                     />
                   </div>
                   <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-paza-dark dark:text-white text-center mb-2 tracking-tight">{t.hero.logoTitle}</h3>
                   <div className="w-12 h-1 bg-gradient-to-r from-paza-blue to-paza-red rounded-full mb-4"></div>
                   <p className="text-gray-500 dark:text-gray-400 font-medium text-center text-sm md:text-base uppercase tracking-widest">{t.hero.logoSubtitle}</p>
                </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Indicateur de défilement */}
      <a href="#about" aria-label="Découvrir" className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-paza-blue hover:border-paza-blue transition-colors">
        <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <CaretDown size={18} stroke={2.2} />
        </motion.span>
      </a>
    </section>
  );
};

export default Hero;
