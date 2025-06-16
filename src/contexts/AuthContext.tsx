import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          // Disable email confirmation to avoid rate limits during development
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        
        // Handle rate limit errors specifically
        if (error.message.includes('over_email_send_rate_limit') || error.message.includes('email rate limit exceeded')) {
          return { error: 'Too many signup attempts. Please wait a few minutes before trying again, or contact support if this persists.' };
        }
        
        // Return user-friendly error messages
        if (error.message.includes('already registered')) {
          return { error: 'An account with this email already exists. Try signing in instead.' };
        }
        if (error.message.includes('Password should be')) {
          return { error: 'Password must be at least 6 characters long' };
        }
        if (error.message.includes('Invalid email') || error.message.includes('email_address_invalid')) {
          return { error: 'Please enter a valid email address' };
        }
        if (error.message.includes('weak password')) {
          return { error: 'Password is too weak. Please use a stronger password' };
        }
        
        return { error: error.message };
      }

      console.log('Signup successful:', data.user?.email);

      // Create profile after successful signup
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                name,
                email,
              },
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Don't fail signup for profile creation issues
          } else {
            console.log('Profile created successfully');
          }
        } catch (profileErr) {
          console.error('Profile creation failed:', profileErr);
          // Don't fail the signup
        }
      }

      return { error: null };
    } catch (err: any) {
      console.error('Unexpected signup error:', err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting signin for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        console.error('Signin error:', error);
        
        // Return user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password. Please check your credentials and try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Please check your email and confirm your account before signing in.' };
        }
        if (error.message.includes('Too many requests')) {
          return { error: 'Too many login attempts. Please try again later.' };
        }
        if (error.message.includes('Invalid API key')) {
          return { error: 'Service temporarily unavailable. Please try again later.' };
        }
        
        return { error: error.message };
      }

      console.log('Signin successful:', data.user?.email);

      // Ensure user has a profile
      if (data.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create one
            console.log('Creating missing profile for user');
            const { error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
                  email: data.user.email || '',
                },
              ]);

            if (createError) {
              console.error('Profile creation error during signin:', createError);
              // Don't fail login for profile issues
            } else {
              console.log('Profile created during signin');
            }
          } else if (profile) {
            console.log('Profile exists for user');
          }
        } catch (profileErr) {
          console.error('Profile check/creation failed:', profileErr);
          // Don't fail login for profile issues
        }
      }

      return { error: null };
    } catch (err: any) {
      console.error('Unexpected signin error:', err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};