'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Diagnostic() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testSupabaseConfig = async () => {
    setLoading(true);
    setStatus('Testing Supabase configuration...');

    try {
      // Check if environment variables are set
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        setStatus('❌ Supabase environment variables not found');
        return;
      }

      // Test basic Supabase connection
      const { data, error } = await supabase.auth.getSession();
      
      if (error && !error.message.includes('session missing')) {
        setStatus(`❌ Supabase config error: ${error.message}`);
      } else {
        setStatus('✅ Supabase configuration working');
      }
    } catch (error) {
      setStatus(`❌ Config test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    setStatus('Testing database connection...');

    try {
      // Test 1: Basic connection
      const { data, error } = await supabase.from('notes').select('count');
      
      if (error) {
        if (error.code === '42P01') {
          setStatus('❌ Notes table does not exist. Run the SQL schema first!');
        } else if (error.message.includes('JWT')) {
          setStatus('❌ Authentication configuration issue');
        } else {
          setStatus(`❌ Database error: ${error.message}`);
        }
      } else {
        setStatus('✅ Database connection successful!');
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setStatus('Testing basic auth...');

    try {
      // First test: Check if Supabase client is configured
      if (!supabase) {
        setStatus('❌ Supabase client not configured');
        return;
      }

      // Second test: Try to get current session (should work even if no user)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError && sessionError.message !== 'Auth session missing!') {
        setStatus(`❌ Auth config error: ${sessionError.message}`);
        return;
      }

      // Third test: Try to get user (this might show "session missing" but that's ok)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError && !userError.message.includes('session missing') && !userError.message.includes('Auth session missing')) {
        setStatus(`❌ Auth error: ${userError.message}`);
      } else if (user) {
        setStatus(`✅ Logged in as: ${user.email}`);
      } else {
        setStatus('✅ Auth working (no user logged in - this is normal)');
      }
    } catch (error) {
      setStatus(`❌ Auth test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setStatus('Testing signup process...');

    const testEmail = `test${Date.now()}@test.com`;
    const testPassword = 'testpass123';

    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword
      });

      if (error) {
        if (error.message.includes('Database error saving new user')) {
          setStatus('❌ Database trigger issue. Tables may not be set up correctly.');
        } else if (error.message.includes('rate limit')) {
          setStatus('❌ Rate limited. Try again later.');
        } else {
          setStatus(`❌ Signup error: ${error.message}`);
        }
      } else {
        setStatus('✅ Signup test successful!');
        // Clean up test user if possible
        if (data.user) {
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      setStatus(`❌ Signup test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 Diagnostic Tool</h1>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-red-900 mb-2">🔧 Database Trigger Issue Fix</h3>
              <p className="text-red-700 text-sm mb-3">
                If the signup test fails with &quot;Database trigger issue&quot;, you need to clean up 
                the old database schema that has problematic triggers.
              </p>
              <div className="bg-white p-3 rounded border text-xs">
                <strong>CLEANUP SQL:</strong> Copy this and run it in Supabase SQL Editor:
                <pre className="mt-2 text-gray-800">{`-- Remove problematic triggers
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS create_user_profile();
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Clean recreate notes table
DROP TABLE IF EXISTS notes CASCADE;
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes and RLS
CREATE INDEX idx_notes_user_id ON notes(user_id);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);`}</pre>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Run These Tests</h3>
              <p className="text-blue-700 text-sm mb-3">
                Run each test to identify what&apos;s not working:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={testSupabaseConfig}
                disabled={loading}
                className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : '0. Test Supabase Config'}
              </button>

              <button
                onClick={testSupabaseConnection}
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : '1. Test Database Connection'}
              </button>

              <button
                onClick={testAuth}
                disabled={loading}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : '2. Test Authentication'}
              </button>

              <button
                onClick={testSignup}
                disabled={loading}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : '3. Test Signup Process'}
              </button>
            </div>

            {status && (
              <div className={`p-4 rounded-md ${
                status.includes('✅') ? 'bg-green-50 text-green-700' : 
                status.includes('❌') ? 'bg-red-50 text-red-700' : 
                'bg-yellow-50 text-yellow-700'
              }`}>
                <strong>Result:</strong> {status}
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Fixes</h3>
              <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                <li><strong>Table not found:</strong> Run SQL from setup page</li>
                <li><strong>Auth errors:</strong> Check Supabase dashboard settings</li>
                <li><strong>Database trigger issues:</strong> Disable email confirmation</li>
                <li><strong>Rate limiting:</strong> Wait and try again</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <a 
                href="/setup"
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Go to Setup →
              </a>
              <a 
                href="/fix"
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Go to Fix Guide →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
