
import React, { useState, useEffect } from 'react';
import { teamMembers, type TeamMember } from '@/data/team';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX as X, IconUser as User, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { IconUsersGroup as UsersThree } from '@tabler/icons-react';
import SectionHeader, { ViewAllClass } from '@/components/SectionHeader';


const MemberCard: React.FC<{ member: TeamMember; onClick: () => void; roleLabel: string }> = ({ member, onClick, roleLabel }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="group relative cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-paza-yellow outline-none"
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-label={member.name}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
  >
    <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-gray-100 dark:bg-gray-800 shadow-md">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
        <h3 className="text-white font-heading font-bold text-base md:text-lg leading-tight">{member.name}</h3>
        <p className="text-paza-yellow text-xs font-medium mt-1 uppercase tracking-wider md:opacity-0 md:group-hover:opacity-100 transition-opacity delay-100">{roleLabel}</p>
      </div>
    </div>
  </motion.div>
);

interface TeamProps {
  isPage?: boolean;
}

const Team: React.FC<TeamProps> = ({ isPage = false }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { t } = useLanguage();

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedMember(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedMember]);

  // Modification ici : slice(0, 4) au lieu de slice(0, 3)
  const displayedMembers = isPage ? teamMembers : teamMembers.slice(0, 4);

  return (
    <section id="team" className={`py-20 bg-white dark:bg-gray-900 transition-colors duration-300 ${isPage ? 'min-h-screen' : ''}`}>
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow={t.nav.team} title={isPage ? t.team.fullPageTitle : t.team.title} subtitle={isPage ? t.team.fullPageSubtitle : t.team.subtitle} icon={UsersThree} accent="yellow" as={isPage ? 'h1' : 'h2'} />

        {/* Display members grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {displayedMembers.map((member) => (
            <MemberCard 
              key={member.id} 
              member={member} 
              onClick={() => setSelectedMember(member)}
              roleLabel={t.team.role}
            />
          ))}
        </div>

        {/* Show 'View All' button if not on full page */}
        {!isPage && (
          <div className="mt-12 text-center">
            <Link 
              to="/team" 
              className={ViewAllClass('blue')}
            >
              {t.team.viewAll} <ArrowRight size={20} stroke={2.2} />
            </Link>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedMember(null)}
                aria-label="Fermer"
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full text-white transition-colors"
              >
                <X size={20} stroke={2.2} />
              </button>
              
              <div className="h-64 relative">
                <img 
                  src={selectedMember.image} 
                  alt={selectedMember.name}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="font-heading font-bold text-2xl text-paza-dark dark:text-white mb-1">{selectedMember.name}</h3>
                <p className="text-paza-blue font-medium mb-4">{t.team.memberRoleDesc}</p>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <User size={16} stroke={1.6} />
                        </div>
                        <p>{t.team.studentDesc}</p>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                        {t.team.quote}
                    </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Team;
