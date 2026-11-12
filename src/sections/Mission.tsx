
import React from 'react';
import { motion } from 'framer-motion';
import { IconShieldCheck as ShieldCheck, IconHeartHandshake as Handshake, IconScale as Scales, IconUsersGroup as UsersThree, IconLeaf as Leaf, IconTarget as Target, IconEye as Eye, IconStar as Star, IconBriefcase as Briefcase } from '@tabler/icons-react';
import { useLanguage } from '@/i18n/LanguageContext';
import SectionHeader from '@/components/SectionHeader';

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

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const pillarIcons = [Scales, ShieldCheck, Handshake];
  const valueIcons = [UsersThree, ShieldCheck, Star, Handshake];
  const domainIcons = [Scales, UsersThree, Handshake, Leaf];

  return (
    <section id="mission" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader eyebrow={t.mission.sectionEyebrow} title={t.mission.sectionTitle} icon={Target} accent="blue" />
        
        {/* Vision & Mission Summary */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-slate-50 dark:bg-gray-800 p-8 rounded-2xl border border-slate-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-paza-blue rounded-xl flex items-center justify-center mb-6">
              <Eye size={24} stroke={1.6} />
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-paza-dark dark:text-white mb-4">{t.mission.visionTitle}</h2>
            <div className="w-16 h-1 bg-paza-blue rounded-full mb-6"></div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {t.mission.visionText}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-slate-50 dark:bg-gray-800 p-8 rounded-2xl border border-slate-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 text-paza-red rounded-xl flex items-center justify-center mb-6">
              <Target size={24} stroke={1.6} />
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-paza-dark dark:text-white mb-4">{t.mission.missionTitle}</h2>
            <div className="w-16 h-1 bg-paza-red rounded-full mb-6"></div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {t.mission.missionText}
            </p>
          </motion.div>
        </div>

        {/* Pillars */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">{t.mission.missionSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {t.mission.missionPillars.map((pillar, idx) => {
              const Icon = pillarIcons[idx];
              return (
                <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 text-paza-blue rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Icon size={32} stroke={1.6} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-white mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{pillar.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Values & Domains Grid */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Values */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="font-heading font-bold text-3xl text-paza-dark dark:text-white mb-8 flex items-center gap-3">
              <Star className="text-yellow-500" stroke={1.6} />
              {t.mission.valuesTitle}
            </h2>
            <div className="space-y-6">
              {t.mission.values.map((val, idx) => {
                const Icon = valueIcons[idx];
                return (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon size={20} stroke={1.6} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{val.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{val.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Domains of Intervention */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="font-heading font-bold text-3xl text-paza-dark dark:text-white mb-8 flex items-center gap-3">
              <Briefcase className="text-emerald-500" stroke={1.6} />
              {t.mission.domainsTitle}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {t.mission.domains.map((domain, idx) => {
                const Icon = domainIcons[idx];
                return (
                  <div key={idx} className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-6 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <Icon className="text-emerald-600 dark:text-emerald-400 mb-4" size={32} stroke={1.6} />
                    <h4 className="font-bold text-gray-800 dark:text-emerald-50">{domain}</h4>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Mission;
