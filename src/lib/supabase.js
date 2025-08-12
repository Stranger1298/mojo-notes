import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  NOTES: 'notes'
};

// Auth helpers
export const auth = {
  signUp: async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            display_name: name
          }
          // Remove emailRedirectTo to avoid 500 errors
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        // Handle rate limiting specifically
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          return { 
            data: null, 
            error: { 
              message: 'Too many signup attempts. Please wait a few minutes and try again.',
              code: 'RATE_LIMIT_EXCEEDED'
            }
          };
        }
        
        // Handle 500 errors
        if (error.status === 500 || error.message.includes('500')) {
          return { 
            data: null, 
            error: { 
              message: 'Server error. Please check your Supabase configuration or try the alternative signup method.',
              code: 'SERVER_ERROR'
            }
          };
        }
        
        return { data, error };
      }

      return { data, error };
    } catch (err) {
      console.error('Signup catch error:', err);
      return { 
        data: null, 
        error: { 
          message: 'Network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR'
        }
      };
    }
  },

  // Alternative registration using API route
  registerUser: async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error,
          code: result.code
        };
      }

      return {
        success: true,
        message: result.message,
        user: result.user
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Handle rate limiting for signin as well
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          return { 
            data: null, 
            error: { 
              message: 'Too many login attempts. Please wait a few minutes and try again.',
              code: 'RATE_LIMIT_EXCEEDED'
            }
          };
        }
        return { data, error };
      }

      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { 
          message: 'Network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR'
        }
      };
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
