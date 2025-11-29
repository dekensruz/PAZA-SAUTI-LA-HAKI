import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, Gavel, Users } from 'lucide-react';

const Mission: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="mission" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-paza-dark mb-4">Notre Vision</h2>
          <div className="w-20 h-1 bg-paza-blue mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nous croyons en une justice équitable et une paix durable. Voici les piliers de notre engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-shadow"
            >
                <div className="w-12 h-12 bg-blue-100 text-paza-blue rounded-lg flex items-center justify-center mb-4">
                    <Gavel size={24} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-800">Droit pour tous</h3>
                <p className="text-gray-600 text-sm">La justice est un droit fondamental, pas un privilège réservé à une élite. Nous combattons pour l'égalité.</p>
            </motion.div>

            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-shadow"
            >
                <div className="w-12 h-12 bg-red-100 text-paza-red rounded-lg flex items-center justify-center mb-4">
                    <Users size={24} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-800">Voix entendue</h3>
                <p className="text-gray-600 text-sm">Chacun mérite d'être écouté et défendu. L'accès à la justice permet à chaque voix de résonner.</p>
            </motion.div>

            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-shadow"
            >
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck size={24} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-800">Paix véritable</h3>
                <p className="text-gray-600 text-sm">Sans justice, il n'y a pas de vraie paix. Nous travaillons pour bâtir des fondations solides.</p>
            </motion.div>

            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-shadow"
            >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                    <HeartHandshake size={24} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-800">Investir l'avenir</h3>
                <p className="text-gray-600 text-sm">Investir dans la paix et la gestion des conflits, c'est investir pour un avenir meilleur pour tous.</p>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Mission;