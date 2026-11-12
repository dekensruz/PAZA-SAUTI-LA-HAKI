import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Logo } from '@/components/Logo';
import { ErrorNote, Spinner } from '@/components/ui';
import { useAuth } from './auth';

const LoginPage: React.FC = () => {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!loading && session && isAdmin) {
    const from = (location.state as { from?: string } | null)?.from ?? '/admin';
    return <Navigate to={from} replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message === 'Invalid login credentials' ? 'E-mail ou mot de passe incorrect.' : error.message);
  };

  const reset = async () => {
    if (!email) return setError("Saisissez d'abord votre e-mail.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin` });
    if (error) setError(error.message);
    else setResetSent(true);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo light />
        <div>
          <p className="font-display text-5xl leading-tight font-medium">
            Espace <em className="text-paza-yellow">rédaction</em>
          </p>
          <p className="mt-4 max-w-md text-slate-400">Rédigez les articles, planifiez les publications et gérez la galerie de Paza Sauti La Haki.</p>
        </div>
        <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-paza-blue/30 blur-3xl" />
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-4xl font-semibold">Connexion</h1>
          {!isSupabaseConfigured && <ErrorNote>Supabase n'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).</ErrorNote>}
          <label className="block">
            <span className="label">E-mail</span>
            <input className="input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block">
            <span className="label">Mot de passe</span>
            <input className="input" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <ErrorNote>{error}</ErrorNote>}
          {resetSent && <p className="text-sm text-emerald-600">Un lien de réinitialisation a été envoyé.</p>}
          <button className="btn-primary w-full !py-3.5" disabled={busy}>
            {busy ? <Spinner className="size-4" /> : 'Se connecter'}
          </button>
          <button type="button" onClick={reset} className="w-full text-center text-sm font-semibold text-slate-500 hover:text-ink dark:hover:text-white">
            Mot de passe oublié ?
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
