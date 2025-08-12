'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function DatabaseSetup() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing database connection...');

    try {
      // Test if notes table exists
      const { data, error } = await supabase
        .from('notes')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          setStatus('❌ Notes table does not exist. Please run the SQL schema in Supabase.');
        } else {
          setStatus('❌ Connection test failed: ' + error.message);
        }
      } else {
        setStatus('✅ Database connection successful! Tables are properly set up.');
      }
    } catch (error) {
      setStatus('❌ Connection error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setStatus('Testing authentication...');

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        setStatus('❌ Auth test failed: ' + error.message);
      } else if (user) {
        setStatus(`✅ Authentication working! Logged in as: ${user.email}`);
      } else {
        setStatus('⚠️ No user logged in. Please sign up or log in first.');
      }
    } catch (error) {
      setStatus('❌ Auth error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sqlSchema = `-- SIMPLIFIED Schema - Copy and paste this SQL into your Supabase SQL Editor

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;

-- Create notes table ONLY (no user_profiles to avoid trigger issues)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notes table
CREATE POLICY "Users can view their own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at on notes
CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlSchema);
      setStatus('✅ SQL schema copied to clipboard!');
    } catch (error) {
      setStatus('❌ Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Setup</h1>
          
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-red-900 mb-2">🚨 Important: Fix Database Error</h3>
              <p className="text-red-700 text-sm mb-2">
                If you&apos;re seeing &quot;Database error saving new user&quot;, it&apos;s because the database 
                tables don&apos;t exist yet. Follow these steps to fix it:
              </p>
              <ol className="text-red-700 text-sm space-y-1 list-decimal list-inside">
                <li><strong>FIRST:</strong> Disable email confirmation in Supabase Auth settings</li>
                <li><strong>SECOND:</strong> Run the SQL schema below in Supabase SQL Editor</li>
                <li><strong>THIRD:</strong> Test the database connection below</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Setup Instructions</h3>
              <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                <li>Copy the SQL schema below</li>
                <li>Go to your Supabase Dashboard → SQL Editor</li>
                <li>Paste and run the SQL to create tables</li>
                <li>Test the connection below</li>
                <li>Return to the main app to start using it</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testConnection}
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Database'}
              </button>

              <button
                onClick={testAuth}
                disabled={loading}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Authentication'}
              </button>
            </div>

            {status && (
              <div className={`p-4 rounded-md ${
                status.includes('✅') ? 'bg-green-50 text-green-700' : 
                status.includes('❌') ? 'bg-red-50 text-red-700' : 
                'bg-yellow-50 text-yellow-700'
              }`}>
                {status}
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">SQL Schema</h3>
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Copy to Clipboard
                </button>
              </div>
              <pre className="text-sm text-gray-800 bg-white p-4 rounded border overflow-x-auto max-h-96">
                {sqlSchema}
              </pre>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-green-900 mb-2">Next Steps</h3>
              <p className="text-green-700 text-sm mb-3">
                After running the SQL schema in Supabase:
              </p>
              <Link 
                href="/"
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 inline-block"
              >
                Go to Main App →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
