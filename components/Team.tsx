
import React, { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Mwangilwa Kituangano Gédéon', image: 'https://i.ibb.co/5xJD99Jh/17.jpg' },
  { id: '2', name: 'Balola Mugisho Daniel', image: 'https://i.ibb.co/BVSPJLgv/18.jpg' },
  { id: '3', name: 'Dekens Ruzuba', image: 'https://i.ibb.co/s9zQCqbj/16.jpg' },
  { id: '4', name: 'Byeka Kipanga Chanceline', image: 'https://i.ibb.co/4ZKVCQDd/14.jpg' },
  { id: '5', name: 'SAFARI MUZERO Xavier', image: 'https://i.ibb.co/PsYjyTpT/13.jpg' },
  { id: '6', name: 'Nabintu Bisimwa Clémence', image: 'https://i.ibb.co/BVsfwjtK/6.jpg' },
  { id: '7', name: 'Irazika Bamporiki Vertueuse', image: 'https://i.ibb.co/LmSdgZq/15.jpg' },
  { id: '8', name: 'Miderho Magadju Dieumerci', image: 'https://i.ibb.co/LdGtgBmv/12.jpg' },
  { id: '9', name: 'Furaha Zirimwagabo Nessia', image: 'https://i.ibb.co/LDnPtQ1L/11.jpg' },
  { id: '10', name: 'Habamungu Magendo Augustin', image: 'https://i.ibb.co/bgqk2mHD/8.jpg' },
  { id: '11', name: 'Karisi Kaboyo Bénédicte', image: 'https://i.ibb.co/VYF1VDs8/19.jpg' },
];

const MemberCard: React.FC<{ member: TeamMember; onClick: () => void; roleLabel: string }> = ({ member, onClick, roleLabel }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="group relative cursor-pointer"
    onClick={onClick}
  >
    <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-gray-100 dark:bg-gray-800 shadow-md">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
        <h3 className="text-white font-bold text-lg leading-tight">{member.name}</h3>
        <p className="text-paza-yellow text-xs font-medium mt-1 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity delay-100">{roleLabel}</p>
      </div>
    </div>
  </motion.div>
);

const Team: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { t } = useLanguage();

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember]);

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-paza-dark dark:text-white mb-4">{t.team.title}</h2>
          <div className="w-20 h-1 bg-paza-yellow mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.team.subtitle}
          </p>
        </div>

        {/* Display all members */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member) => (
            <MemberCard 
              key={member.id} 
              member={member} 
              onClick={() => setSelectedMember(member)}
              roleLabel={t.team.role}
            />
          ))}
        </div>
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
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full text-white transition-colors"
              >
                <X size={20} />
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
                            <User size={16} />
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