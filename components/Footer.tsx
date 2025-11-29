
import React from 'react';
import { Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-paza-dark text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4 bg-white p-2 rounded-lg w-fit">
              <img src="https://i.ibb.co/1t3CxJcp/PSLH.png" alt="PSLH Logo" className="w-10 h-10 object-contain" />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-paza-dark text-sm leading-none">PAZA SAUTI</span>
                <span className="font-heading font-bold text-paza-red text-xs leading-none">LA HAKI</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-paza-blue transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-paza-blue transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-paza-blue transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white border-l-4 border-paza-blue pl-3">{t.footer.quickLinks}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:text-white transition-colors cursor-pointer">{t.nav.home}</a></li>
              <li><a href="#mission" onClick={(e) => handleLinkClick(e, 'mission')} className="hover:text-white transition-colors cursor-pointer">{t.nav.mission}</a></li>
              <li><a href="#team" onClick={(e) => handleLinkClick(e, 'team')} className="hover:text-white transition-colors cursor-pointer">{t.nav.team}</a></li>
              <li><a href="#blog" onClick={(e) => handleLinkClick(e, 'blog')} className="hover:text-white transition-colors cursor-pointer">{t.nav.blog}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
             <h4 className="font-heading font-bold text-lg mb-6 text-white border-l-4 border-paza-red pl-3">{t.footer.contactUs}</h4>
             <ul className="space-y-4 text-gray-400">
               <li className="flex items-start gap-3">
                 <MapPin className="text-paza-red shrink-0" size={20} />
                 <span>Goma, Nord-Kivu<br/>République Démocratique du Congo</span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone className="text-paza-red shrink-0" size={20} />
                 <span>+243 977 812 672</span>
               </li>
             </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Paza Sauti La Haki. {t.footer.rights}
          </p>
          <p className="text-gray-600 text-sm">
            {t.footer.developedBy} <a href="https://portfoliodek.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-paza-blue hover:text-white transition-colors font-semibold">Dekens Ruzuba</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
