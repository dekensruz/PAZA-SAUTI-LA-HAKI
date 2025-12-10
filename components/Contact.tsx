
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, User, MessageSquare, Briefcase } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construct the mailto link
    const recipient = "info@pazasautilahaki.org";
    const mailSubject = `[Contact Site Web] ${formData.subject}: ${formData.name}`;
    const mailBody = `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    // Simulate loading for better UX, then open mail client
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Open the user's email client
      window.location.href = mailtoLink;
      
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-paza-dark dark:text-white mb-4">{t.contact.title}</h2>
          <div className="w-20 h-1 bg-paza-red mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-5">
            
            {/* Contact Info Side (Left) */}
            <div className="bg-paza-blue p-8 md:col-span-2 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-2xl mb-6">{t.contact.infoTitle}</h3>
                <p className="mb-8 text-blue-100 leading-relaxed">
                  {t.contact.infoDesc}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-blue-200" />
                    <span className="text-sm">{t.contact.servicePartnership}</span>
                  </div>
                </div>
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
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-gray-800 dark:text-white mb-2">{t.contact.successTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t.contact.successDesc}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.contact.form.name}</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
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
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.contact.form.email}</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
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
                        <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select
                            name="subject"
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
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.contact.form.message}</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
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

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-paza-dark hover:bg-gray-800 dark:bg-paza-blue dark:hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        {t.contact.form.submit} <Send size={18} />
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
