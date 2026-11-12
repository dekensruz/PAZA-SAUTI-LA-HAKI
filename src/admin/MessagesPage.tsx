import React, { useState } from 'react';
import { ArrowBendUpLeft, EnvelopeOpen, Trash } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/format';
import { useAsync } from '@/lib/useAsync';
import { ErrorNote, Spinner } from '@/components/ui';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const MessagesPage: React.FC = () => {
  const { data, error, loading, reload } = useAsync(async () => {
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Message[];
  }, []);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = async (m: Message) => {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', m.id);
      reload();
    }
  };

  const remove = async (m: Message) => {
    if (!confirm(`Supprimer définitivement le message de ${m.name} ?`)) return;
    await supabase.from('contact_messages').delete().eq('id', m.id);
    reload();
  };

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold">Messages</h1>
      <p className="mt-1 mb-8 text-slate-500">Messages reçus via le formulaire de contact du site.</p>
      {error && <ErrorNote>{error.message}</ErrorNote>}
      {loading && !data && <div className="flex justify-center py-20 text-paza-blue"><Spinner /></div>}
      <div className="card divide-y divide-ink/5 overflow-hidden dark:divide-white/5">
        {(data ?? []).map((m) => (
          <div key={m.id}>
            <button onClick={() => toggle(m)} className="flex w-full items-center gap-4 p-4 text-left hover:bg-slate-50 dark:hover:bg-white/5">
              <span className={`size-2.5 shrink-0 rounded-full ${m.is_read ? 'bg-transparent' : 'bg-paza-blue'}`} />
              <div className="min-w-0 flex-1">
                <p className={`truncate ${m.is_read ? 'font-medium' : 'font-bold'}`}>{m.name} <span className="font-normal text-slate-500">· {m.subject}</span></p>
                <p className="truncate text-sm text-slate-500">{m.message}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{formatDate(m.created_at, 'fr', 'd MMM, HH:mm')}</span>
            </button>
            {openId === m.id && (
              <div className="bg-slate-50 px-10 py-5 dark:bg-white/5">
                <p className="text-sm text-slate-500">{m.email}</p>
                <p className="mt-3 whitespace-pre-wrap">{m.message}</p>
                <div className="mt-4 flex gap-2">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject ?? 'Votre message'}`)}`} className="btn-blue !px-4 !py-2"><ArrowBendUpLeft size={16} /> Répondre</a>
                  <button onClick={() => remove(m)} className="btn-ghost !px-4 !py-2"><Trash size={16} /> Supprimer</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {data?.length === 0 && (
          <p className="flex flex-col items-center gap-2 p-12 text-slate-500"><EnvelopeOpen size={32} /> Aucun message pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
