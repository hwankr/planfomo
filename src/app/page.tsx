'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900"
        suppressHydrationWarning
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  // if (!session) {
  //   return <Login />;
  // }

  return <Dashboard session={session} />;
}
