import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Spinner } from '@/components/ui';

interface AuthState {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({ session: null, isAdmin: false, loading: true, signOut: async () => {} });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const check = async (s: Session | null) => {
      setSession(s);
      if (!s) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase.rpc('is_admin');
      if (active) {
        setIsAdmin(Boolean(data));
        setLoading(false);
      }
    };
    supabase.auth.getSession().then(({ data }) => check(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setLoading(true);
      // Appel différé : on évite d'appeler Supabase depuis le callback lui-même
      setTimeout(() => check(s), 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return <AuthContext.Provider value={{ session, isAdmin, loading, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const RequireAdmin: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-paza-blue">
        <Spinner className="size-8" />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-display text-3xl font-semibold">Accès refusé</h1>
        <p className="max-w-md text-slate-600 dark:text-slate-400">
          Le compte <strong>{session.user.email}</strong> n'est pas administrateur. Ajoutez son e-mail à la table <code>admin_users</code> dans Supabase.
        </p>
        <button className="btn-ghost" onClick={signOut}>Se déconnecter</button>
      </div>
    );
  }
  return <>{children}</>;
};
