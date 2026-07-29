import { createContext, useContext, useEffect, useState, createElement, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase, getChildToken, setChildToken, clearChildToken } from './supabase';
import type { Family, Profile } from './types';

export type Role = 'parent' | 'child' | null;

interface AuthContextValue {
  session: Session | null;
  role: Role;
  profile: Profile | null;
  family: Family | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginChild: (token: string, profile: Profile, family: Family) => void;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  role: null,
  profile: null,
  family: null,
  loading: true,
  signOut: async () => {},
  loginChild: () => {},
});

const CHILD_SESSION_KEY = 'eddy_child_session';

interface ChildSession {
  profile: Profile;
  family: Family;
}

function loadChildSession(): ChildSession | null {
  const raw = localStorage.getItem(CHILD_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ChildSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const childToken = getChildToken();
    const childSession = childToken ? loadChildSession() : null;
    if (childToken && childSession) {
      setRole('child');
      setProfile(childSession.profile);
      setFamily(childSession.family);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (getChildToken()) return; // child session already handled above
    if (!session) {
      setRole(null);
      setProfile(null);
      setFamily(null);
      return;
    }
    setRole('parent');
    let cancelled = false;
    (async () => {
      const { data: parentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .maybeSingle();
      if (cancelled) return;
      setProfile(parentProfile as Profile | null);
      if (parentProfile) {
        const { data: parentFamily } = await supabase
          .from('families')
          .select('*')
          .eq('id', parentProfile.family_id)
          .maybeSingle();
        if (!cancelled) setFamily(parentFamily as Family | null);
      } else {
        setFamily(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const loginChild = (token: string, childProfile: Profile, childFamily: Family) => {
    setChildToken(token);
    localStorage.setItem(CHILD_SESSION_KEY, JSON.stringify({ profile: childProfile, family: childFamily }));
    setRole('child');
    setProfile(childProfile);
    setFamily(childFamily);
  };

  const signOut = async () => {
    if (role === 'child') {
      clearChildToken();
      localStorage.removeItem(CHILD_SESSION_KEY);
      setRole(null);
      setProfile(null);
      setFamily(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return createElement(
    AuthContext.Provider,
    { value: { session, role, profile, family, loading, signOut, loginChild } },
    children,
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireParent({ children }: { children: ReactNode }) {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (role !== 'parent') return createElement(Navigate, { to: '/login', replace: true });
  return children;
}

export function RequireChild({ children }: { children: ReactNode }) {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (role !== 'child') return createElement(Navigate, { to: '/kid-login', replace: true });
  return children;
}
