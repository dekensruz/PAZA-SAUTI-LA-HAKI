import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Envelope, MapPin, PaperPlaneRight, Phone } from '@phosphor-icons/react';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';
import { ErrorNote, Spinner } from '@/components/ui';

const empty = { name: '', email: '', subject: '', message: '' };

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const f = t.contact.form;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject || null,
      message: form.message.trim(),
    });
    if (error) {
      console.error(error);
      setStatus('error');
      return;
    }
    setForm(empty);
    setStatus('sent');
  };

  return (
    <section id="contact" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <div className="grid overflow-hidden rounded-[2.5rem] bg-ink text-white lg:grid-cols-5">
          <div className="relative flex flex-col justify-between gap-12 p-10 md:p-14 lg:col-span-2">
            <div className="absolute -top-24 -left-24 size-72 rounded-full bg-paza-blue/30 blur-3xl" />
            <div className="relative">
              <span className="eyebrow mb-5 !text-paza-yellow">{t.contact.infoTitle}</span>
              <h2 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight md:text-5xl">{t.contact.title}</h2>
              <p className="mt-5 leading-relaxed text-slate-300">{t.contact.subtitle}</p>
            </div>
            <ul className="relative space-y-5 text-slate-200">
              <li className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-white/10"><MapPin size={20} weight="duotone" /></span>
                Goma, Nord-Kivu, RDC
              </li>
              <li className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-white/10"><Phone size={20} weight="duotone" /></span>
                <a href="tel:+243977812672" className="hover:text-white">+243 977 812 672</a>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-white/10"><Envelope size={20} weight="duotone" /></span>
                <a href="mailto:info@pazasautilahaki.org" className="break-all hover:text-white">info@pazasautilahaki.org</a>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 text-ink md:p-14 lg:col-span-3 dark:bg-ink-soft dark:text-white">
            {status === 'sent' ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={64} weight="duotone" className="text-emerald-500" />
                <h3 className="mt-6 font-display text-3xl font-semibold">{t.contact.successTitle}</h3>
                <p className="mt-3 text-slate-600 dark:text-slate-400">{t.contact.successDesc}</p>
                <button onClick={() => setStatus('idle')} className="btn-ghost mt-8">OK</button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="label">{f.name}</span>
                  <input required maxLength={120} name="name" value={form.name} onChange={onChange} placeholder={f.namePlaceholder} className="input" autoComplete="name" />
                </label>
                <label className="block">
                  <span className="label">{f.email}</span>
                  <input required type="email" maxLength={200} name="email" value={form.email} onChange={onChange} placeholder={f.emailPlaceholder} className="input" autoComplete="email" />
                </label>
                <label className="block md:col-span-2">
                  <span className="label">{f.subject}</span>
                  <select required name="subject" value={form.subject} onChange={onChange} className="input">
                    <option value="" disabled>{f.subjectPlaceholder}</option>
                    {Object.values(f.subjects).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="label">{f.message}</span>
                  <textarea required maxLength={5000} name="message" rows={6} value={form.message} onChange={onChange} placeholder={f.messagePlaceholder} className="input resize-none" />
                </label>
                {status === 'error' && (
                  <div className="md:col-span-2">
                    <ErrorNote>{f.error}</ErrorNote>
                  </div>
                )}
                <div className="md:col-span-2">
                  <button type="submit" disabled={status === 'sending'} className="btn-blue w-full !py-4 text-base md:w-auto md:!px-10">
                    {status === 'sending' ? <><Spinner className="size-4" /> {f.sending}</> : <>{f.submit} <PaperPlaneRight size={18} weight="bold" /></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
