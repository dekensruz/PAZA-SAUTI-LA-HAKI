import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Article, CalendarDots, Images, EnvelopeSimple, SignOut, ArrowSquareOut, Moon, Sun, List, X } from '@phosphor-icons/react';
import { useAuth } from './auth';
import { useTheme } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/Navbar';

const AdminLayout: React.FC = () => {
  const { session, signOut } = useAuth();
  const { isDark, toggle } = useTheme();
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false)
      .then(({ count }) => setUnread(count ?? 0));
  }, []);

  const items = [
    { to: '/admin', label: 'Articles', icon: Article, end: true },
    { to: '/admin/calendar', label: 'Calendrier', icon: CalendarDots },
    { to: '/admin/gallery', label: 'Galerie', icon: Images },
    { to: '/admin/messages', label: 'Messages', icon: EnvelopeSimple, badge: unread },
  ];

  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map(({ to, label, icon: Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              isActive ? 'bg-white text-ink shadow-sm dark:bg-white/10 dark:text-white' : 'text-slate-500 hover:bg-white/60 hover:text-ink dark:hover:bg-white/5 dark:hover:text-white'
            }`
          }
        >
          <Icon size={20} weight="duotone" />
          <span className="flex-1">{label}</span>
          {badge ? <span className="rounded-full bg-paza-red px-2 py-0.5 text-[0.7rem] font-bold text-white">{badge}</span> : null}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100/70 lg:grid lg:grid-cols-[16rem_1fr] dark:bg-paper-dark">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-8 border-r border-ink/5 bg-slate-100 p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 dark:border-white/5 dark:bg-ink ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <Link to="/admin" className="px-1">
          <Logo />
        </Link>
        {nav}
        <div className="mt-auto space-y-1 text-sm">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2 font-semibold text-slate-500 hover:text-ink dark:hover:text-white">
            <ArrowSquareOut size={18} /> Voir le site
          </a>
          <button onClick={toggle} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 font-semibold text-slate-500 hover:text-ink dark:hover:text-white">
            {isDark ? <Sun size={18} /> : <Moon size={18} />} Thème
          </button>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 font-semibold text-slate-500 hover:text-paza-red">
            <SignOut size={18} /> Déconnexion
          </button>
          <p className="truncate px-3 pt-2 text-xs text-slate-400">{session?.user.email}</p>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="min-w-0">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/5 bg-slate-100/90 px-4 py-3 backdrop-blur lg:hidden dark:bg-ink/90">
          <Logo compact />
          <button onClick={() => setOpen((o) => !o)} className="flex size-10 items-center justify-center rounded-full hover:bg-ink/5" aria-label="Menu">
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
        <main className="mx-auto max-w-7xl p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
