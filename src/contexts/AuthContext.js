'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { user } = await auth.getCurrentUser();
      setUser(user);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      // First try the standard Supabase signup
      const { data, error } = await auth.signUp(email, password, name);
      
      if (error) {
        console.log('Standard signup error:', error);
        
        // If rate limited or server error, try the alternative registration method
        if (error.code === 'RATE_LIMIT_EXCEEDED' || error.code === 'SERVER_ERROR') {
          console.log('Trying alternative registration due to:', error.code);
          const fallbackResult = await auth.registerUser(name, email, password);
          
          if (fallbackResult.success) {
            // After successful registration, try to sign in
            const loginResult = await auth.signIn(email, password);
            if (loginResult.data && !loginResult.error) {
              return { 
                success: true, 
                message: 'Account created and logged in successfully!' 
              };
            } else {
              return { 
                success: true, 
                message: 'Account created successfully! Please log in to continue.',
                needsLogin: true
              };
            }
          } else {
            return { 
              success: false, 
              error: fallbackResult.error,
              code: fallbackResult.code
            };
          }
        }
        
        if (error.message.includes('User already registered')) {
          return { 
            success: false, 
            error: 'An account with this email already exists. Please try logging in instead.',
            code: 'USER_EXISTS'
          };
        }

        return { success: false, error: error.message };
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        return { 
          success: true, 
          message: 'Please check your email to confirm your account before logging in.',
          needsConfirmation: true
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      
      // If there's a network error, try the alternative method
      console.log('Trying alternative registration due to network error...');
      const fallbackResult = await auth.registerUser(name, email, password);
      
      if (fallbackResult.success) {
        const loginResult = await auth.signIn(email, password);
        if (loginResult.data && !loginResult.error) {
          return { 
            success: true, 
            message: 'Account created and logged in successfully!' 
          };
        } else {
          return { 
            success: true, 
            message: 'Account created successfully! Please log in to continue.',
            needsLogin: true
          };
        }
      }
      
      return { success: false, error: 'Failed to create account. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
