
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { UsersThree, ArrowRight, Quotes } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yImage = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Split description for creative editorial layout
  const parts = t.about.description.split('.');
  const firstSentence = parts[0] + '.';
  const restOfText = parts.slice(1).join('.').trim();

  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden relative" ref={ref}>
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-slate-50 dark:bg-gray-800/50 lg:rounded-l-[120px] z-0"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text / Narrative - spans 5 columns */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-paza-blue/10 dark:bg-paza-blue/20 rounded-full text-paza-blue border border-paza-blue/20">
              <UsersThree size={18} weight="duotone" />
              <span className="font-heading font-bold text-xs tracking-widest uppercase">{t.about.subtitle}</span>
            </div>
            
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-paza-dark dark:text-white mb-10 leading-tight">
              {t.about.title}
            </h2>
            
            <div className="relative mb-8 pt-4">
              <Quotes className="absolute -top-4 -left-2 md:-left-6 text-paza-red/20 rotate-180" size={64} weight="fill" />
              <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-snug font-bold relative z-10 pl-4 md:pl-6 border-l-4 border-paza-red">
                {firstSentence}
              </p>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 leading-loose text-lg mb-10 pl-4 md:pl-6">
              {restOfText}
            </p>
            
            <Link to="/mission" className="inline-flex items-center gap-3 px-8 py-4 bg-paza-dark dark:bg-white text-white dark:text-paza-dark font-bold rounded-full hover:bg-paza-blue dark:hover:bg-paza-blue hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group ml-4 md:ml-6">
              {t.hero.ctaMission}
              <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Image Block - spans 7 columns */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative mt-8 lg:mt-0">
            <motion.div 
              style={{ y: yImage }}
              className="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white dark:border-gray-800 bg-gray-100 z-10"
            >
              {/* Subtle overlay to blend slightly with theme */}
              <div className="absolute inset-0 bg-paza-blue/5 mix-blend-overlay z-10 pointer-events-none"></div>
              
              <img 
                src="https://i.ibb.co/xSQtN5SZ/IMG-131.jpg" 
                alt="Formation Pôle Institute - Équipe Paza Sauti La Haki" 
                className="w-full h-auto block object-contain transform hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </motion.div>
            
            {/* Cinematic Decorative Blurs */}
            <div className="absolute top-1/4 -right-8 w-48 md:w-64 h-48 md:h-64 bg-paza-red/20 blur-[80px] rounded-full -z-0"></div>
            <div className="absolute -bottom-10 left-1/4 w-48 md:w-64 h-48 md:h-64 bg-paza-blue/20 blur-[80px] rounded-full -z-0"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
