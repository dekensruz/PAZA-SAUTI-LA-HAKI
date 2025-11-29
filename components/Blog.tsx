import React, { useState } from 'react';
import { BlogPost } from '../types';
import { Calendar, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: "L'ACCÈS À LA JUSTICE",
    summary: "La justice n'est pas un privilège, c'est le fondement de notre société.",
    date: '29 Novembre 2025',
    image: 'https://www.jambonews.net/wp-content/uploads/2024/03/rci-justice-balance.jpg',
    contentPoints: [
      "La justice, c’est un droit pour tous, pas un privilège pour quelques-uns.",
      "Chacun mérite d’être écouté et défendu, peu importe qui il est.",
      "L’accès à la justice, c’est permettre à chaque voix d’être entendue.",
      "Sans justice, il n’y a pas de vraie paix.",
      "Être jeune ne veut pas dire être sans droits.",
      "La justice, c’est le chemin vers l’égalité."
    ]
  },
  {
    id: '2',
    title: "PAIX ET SENSIBILITÉ AUX CONFLITS",
    summary: "Comprendre les conflits pour mieux bâtir une paix durable.",
    date: '29 Novembre 2025',
    image: 'https://icaworldcoopcongress.coop/wp-content/uploads/2021/09/iStock-1069557312-1-scaled.jpg',
    contentPoints: [
      "Sans la paix, pas de progrès durable.",
      "Investir dans la paix c'est investir pour un avenir meilleur.",
      "La paix est entre nos mains, bâtissons-la.",
      "Être sensible aux conflits, c’est savoir quand il faut agir pour éviter le pire.",
      "Être sensible aux conflits, c’est déjà protéger son école, sa famille, sa communauté.",
      "Plus tu es sensible aux conflits, plus tu es capable de bâtir la paix.",
      "Ignorer les petits conflits, c’est risquer de voir naître de grands problèmes.",
      "Savoir écouter, observer, prévenir : c’est ça être sensible aux conflits."
    ]
  }
];

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-paza-dark mb-4">Articles Récents</h2>
                <div className="w-20 h-1 bg-paza-red rounded-full mb-4"></div>
                <p className="text-gray-600">Sensibilisation et éducation pour le changement.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {blogPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden relative group cursor-pointer" onClick={() => setSelectedPost(post)}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-paza-blue flex items-center gap-1">
                    <Calendar size={12} /> {post.date}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 
                  className="font-heading font-bold text-2xl text-gray-800 mb-4 group-hover:text-paza-blue transition-colors cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-6 flex-1">
                  {post.summary}
                </p>

                <button 
                  onClick={() => setSelectedPost(post)}
                  className="self-start text-paza-blue font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm uppercase tracking-wide"
                >
                    Lire plus <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
               <div className="h-64 md:h-80 relative">
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                   <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-paza-blue flex items-center gap-1">
                      <Calendar size={12} /> {selectedPost.date}
                  </div>
               </div>

               <div className="p-8 md:p-10">
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-paza-dark mb-6">
                    {selectedPost.title}
                  </h2>
                  
                  <div className="space-y-4">
                     {selectedPost.contentPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                            <div className="min-w-[8px] h-[8px] rounded-full bg-paza-red mt-2.5"></div>
                            <p className="text-gray-700 leading-relaxed text-lg">{point}</p>
                        </div>
                     ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                      <button 
                        onClick={() => setSelectedPost(null)}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Fermer
                      </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Blog;