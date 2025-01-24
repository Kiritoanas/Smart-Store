import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { initializeNotifications } from './useNotifications';

interface User {
  id: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('خطأ في جلب الجلسة:', error);
        setError('حدث خطأ في التحقق من حالة تسجيل الدخول');
      } else if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata.role || 'customer'
        };
        setUser(userData);
        // Initialize notifications for the user
        initializeNotifications(userData.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata.role || 'customer'
        };
        setUser(userData);
        // Initialize notifications for the user
        initializeNotifications(userData.id);
      } else {
        setUser(null);
      }
      setIsLoading(false);
      setError(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, error };
}