
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Users, ExternalLink } from 'lucide-react';

const Partners: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* About / Origin Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <Users className="text-paza-blue" size={24} />
                    <span className="font-heading font-bold text-lg text-paza-blue tracking-wide uppercase">{t.about.title}</span>
                </div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-paza-dark dark:text-white mb-6 leading-tight">
                    {t.about.subtitle}
                </h2>
                <div className="w-20 h-1 bg-paza-blue rounded-full mb-6"></div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t.about.description}
                </p>
            </motion.div>
            
            <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: 0.2 }}
                 className="relative"
            >
                 <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center p-8">
                      {/* Using a collage or generic team/formation image concept */}
                       <img 
                          src="https://i.ibb.co/xSQtN5SZ/IMG-131.jpg" 
                          alt="Paza Sauti Team" 
                          className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-700"
                        />
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-paza-red/10 rounded-full blur-2xl"></div>
                 <div className="absolute -top-6 -right-6 w-24 h-24 bg-paza-blue/10 rounded-full blur-2xl"></div>
            </motion.div>
        </div>

        {/* Partners Grid */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
                <h3 className="font-heading font-bold text-2xl text-paza-dark dark:text-white">{t.about.partnersTitle}</h3>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                {t.about.partners.map((partner, index) => (
                    <motion.a
                        key={index}
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <div className="h-24 w-48 flex items-center justify-center mb-4 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                             <img 
                                src={partner.logo} 
                                alt={partner.name} 
                                className="max-w-full max-h-full object-contain filter hover:brightness-110 transition-all"
                             />
                        </div>
                        <span className="flex items-center gap-1 text-sm font-semibold text-gray-500 group-hover:text-paza-blue transition-colors">
                            {partner.name} <ExternalLink size={12} />
                        </span>
                    </motion.a>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Partners;
