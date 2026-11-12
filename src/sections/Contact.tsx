
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconSend as PaperPlaneRight, IconCircleCheck as CheckCircle, IconUser as User, IconMessageCircle as ChatCircle, IconBriefcase as Briefcase, IconMail as EnvelopeSimple, IconPhone as Phone, IconBrandWhatsapp as WhatsappLogo, IconMapPin as MapPin, IconAt as At } from '@tabler/icons-react';
import SectionHeader from '@/components/SectionHeader';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasError(false);
    const subjects = t.contact.form.subjects;
    const subjectLabel =
      { rejoindre: subjects.join, partenariat: subjects.partner, aide: subjects.help, autre: subjects.other }[formData.subject] || formData.subject;
    const { error } = await supabase.from('contact_messages').insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: subjectLabel || null,
      message: formData.message.trim(),
    });
    setIsSubmitting(false);

    // Sur téléphone : le message part aussi sur WhatsApp (+243 977 812 672), pré-rempli
    if (/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent)) {
      const text = [
        `*[Contact Site Web]* ${subjectLabel || ''}`.trim(),
        `Nom : ${formData.name.trim()}`,
        `Email : ${formData.email.trim()}`,
        '',
        formData.message.trim(),
      ].join('\n');
      window.location.href = `https://wa.me/243977812672?text=${encodeURIComponent(text)}`;
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
      return;
    }

    if (error) {
      console.error(error);
      setHasError(true);
      return;
    }
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow={t.nav.contact} title={t.contact.title} subtitle={t.contact.subtitle} icon={EnvelopeSimple} accent="red" />

        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-5">
            
            {/* Contact Info Side (Left) */}
            <div className="bg-paza-blue p-8 md:col-span-2 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-2xl mb-6">{t.contact.infoTitle}</h3>
                <p className="mb-8 text-blue-100 leading-relaxed">
                  {t.contact.infoDesc}
                </p>
                
                <ul className="space-y-3">
                  {[
                    { icon: WhatsappLogo, label: 'WhatsApp', value: '+243 977 812 672', href: 'https://wa.me/243977812672' },
                    { icon: Phone, label: t.contact.callUs, value: '+243 977 812 672', href: 'tel:+243977812672' },
                    { icon: At, label: t.contact.writeUs, value: 'info@pazasautilahaki.org', href: 'mailto:info@pazasautilahaki.org' },
                    { icon: MapPin, label: t.contact.findUs, value: 'Goma, Nord-Kivu, RDC' },
                  ].map(({ icon: Icon, label, value, href }) => {
                    const inner = (
                      <>
                        <span className="w-10 h-10 shrink-0 rounded-full bg-white/15 flex items-center justify-center">
                          <Icon size={20} stroke={1.6} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs uppercase tracking-wider text-blue-100">{label}</span>
                          <span className="block font-semibold text-sm break-all">{value}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={label}>
                        {href ? (
                          <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-2 -mx-2 hover:bg-white/10 transition-colors">
                            {inner}
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 p-2 -mx-2">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-6 text-xs text-blue-100 flex items-start gap-2 md:hidden">
                  <WhatsappLogo size={16} className="shrink-0 mt-0.5" /> {t.contact.whatsappHint}
                </p>
              </div>

              {/* Decorative circles */}
              <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Form Side (Right) */}
            <div className="p-8 md:p-10 md:col-span-3">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} stroke={1.6} />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-gray-800 dark:text-white mb-2">{t.contact.successTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t.contact.successDesc}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.contact.form.name} <span className="text-paza-red" aria-hidden>*</span></label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} stroke={1.6} />
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-paza-blue focus:border-transparent outline-none transition-all text-gray-800 dark:text-white"
                          placeholder={t.contact.form.namePlaceholder}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.contact.form.email} <span className="text-paza-red" aria-hidden>*</span></label>
                      <div className="relative">
                        <At className="absolute left-3 top-3 text-gray-400" size={18} stroke={1.6} />
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-paza-blue focus:border-transparent outline-none transition-all text-gray-800 dark:text-white"
                          placeholder={t.contact.form.emailPlaceholder}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.contact.form.subject}</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} stroke={1.6} />
                        <select
                            name="subject"
                            aria-label={t.contact.form.subject}
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-paza-blue focus:border-transparent outline-none transition-all text-gray-800 dark:text-white appearance-none"
                        >
                            <option value="">{t.contact.form.subjectPlaceholder}</option>
                            <option value="rejoindre">{t.contact.form.subjects.join}</option>
                            <option value="partenariat">{t.contact.form.subjects.partner}</option>
                            <option value="aide">{t.contact.form.subjects.help}</option>
                            <option value="autre">{t.contact.form.subjects.other}</option>
                        </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.contact.form.message} <span className="text-paza-red" aria-hidden>*</span></label>
                    <div className="relative">
                      <ChatCircle className="absolute left-3 top-3 text-gray-400" size={18} stroke={1.6} />
                      <textarea 
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-paza-blue focus:border-transparent outline-none transition-all resize-none text-gray-800 dark:text-white"
                        placeholder={t.contact.form.messagePlaceholder}
                      ></textarea>
                    </div>
                  </div>

                  {hasError && (
                    <p className="text-sm text-paza-red bg-paza-red/5 border border-paza-red/20 rounded-lg px-4 py-3">{t.contact.form.error}</p>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-paza-dark hover:bg-gray-800 dark:bg-paza-blue dark:hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        {t.contact.form.submit} <PaperPlaneRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
