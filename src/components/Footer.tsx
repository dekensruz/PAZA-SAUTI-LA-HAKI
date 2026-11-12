
import { brand } from '@/lib/media';
import React from 'react';
import { IconPhone as Phone, IconMapPin as MapPin, IconBrandWhatsapp as WhatsappLogo, IconMail as Envelope } from '@tabler/icons-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-paza-dark text-white pt-16 pb-8">
      <div className="absolute inset-x-0 top-0 flex h-1" aria-hidden>
        <span className="flex-1 bg-paza-blue" /><span className="flex-1 bg-paza-yellow" /><span className="flex-1 bg-paza-red" />
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4 bg-white p-2 rounded-lg w-fit">
              <img src={brand.logo} alt="PSLH Logo" className="w-10 h-10 object-contain" />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-paza-dark text-sm leading-none">PAZA SAUTI</span>
                <span className="font-heading font-bold text-paza-red text-xs leading-none">LA HAKI</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { href: 'https://wa.me/243977812672', label: 'WhatsApp', icon: WhatsappLogo, cls: 'hover:bg-[#25D366]' },
                { href: 'tel:+243977812672', label: 'Téléphone', icon: Phone, cls: 'hover:bg-paza-blue' },
                { href: 'mailto:info@pazasautilahaki.org', label: 'E-mail', icon: Envelope, cls: 'hover:bg-paza-red' },
              ].map(({ href, label, icon: Icon, cls }) => (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={label} title={label} className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-colors text-white ${cls}`}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white border-l-4 border-paza-blue pl-3">{t.footer.quickLinks}</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-400">
              <li><Link to="/" onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">{t.nav.home}</Link></li>
              <li><Link to="/mission" onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">{t.nav.mission}</Link></li>
              <li><Link to="/team" onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">{t.nav.team}</Link></li>
              <li><Link to="/blog" onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">{t.nav.blog}</Link></li>
              <li><Link to="/gallery" onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">{t.nav.gallery}</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors cursor-pointer">{t.nav.faq}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors cursor-pointer">{t.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
             <h4 className="font-heading font-bold text-lg mb-6 text-white border-l-4 border-paza-red pl-3">{t.footer.contactUs}</h4>
             <ul className="space-y-4 text-gray-400">
               <li className="flex items-start gap-3">
                 <MapPin className="text-paza-red shrink-0" size={20} stroke={1.6} />
                 <span>Goma, Nord-Kivu<br/>République Démocratique du Congo</span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone className="text-paza-red shrink-0" size={20} stroke={1.6} />
                 <a href="tel:+243977812672" className="hover:text-white transition-colors">+243 977 812 672</a>
               </li>
               <li className="flex items-center gap-3">
                 <Envelope className="text-paza-red shrink-0" size={20} stroke={1.6} />
                 <a href="mailto:info@pazasautilahaki.org" className="hover:text-white transition-colors break-all">info@pazasautilahaki.org</a>
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