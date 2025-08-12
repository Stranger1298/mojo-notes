'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FixAuth() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-6">🚨 Fix Authentication Error (500)</h1>
          
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-red-900 mb-2">Error Explanation</h3>
              <p className="text-red-700 text-sm">
                The 500 Internal Server Error occurs because your Supabase project has email confirmation 
                enabled but no email provider is configured. This prevents users from signing up.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-3">
                🔧 Step {step}: Fix Supabase Authentication Settings
              </h3>
              
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-blue-700 text-sm">
                    <strong>Go to your Supabase Dashboard:</strong>
                  </p>
                  <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside ml-4">
                    <li>Open <a href="https://supabase.com/dashboard" target="_blank" className="underline text-blue-800">Supabase Dashboard</a></li>
                    <li>Select your project: <code className="bg-blue-100 px-2 py-1 rounded">cgpkhgqzczlwmjvzxtli</code></li>
                    <li>Go to <strong>Authentication</strong> → <strong>Settings</strong> (left sidebar)</li>
                    <li>Find <strong>&quot;Enable email confirmations&quot;</strong></li>
                    <li><strong>DISABLE</strong> email confirmations (turn it OFF)</li>
                    <li>Click <strong>Save</strong></li>
                  </ol>
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700"
                  >
                    Next Step →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-blue-700 text-sm">
                    <strong>Set up Database Tables:</strong>
                  </p>
                  <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside ml-4">
                    <li>In the same Supabase Dashboard, go to <strong>SQL Editor</strong></li>
                    <li>Create a new query</li>
                    <li>Copy the SQL from the <Link href="/setup" className="underline text-blue-800">Setup Page</Link></li>
                    <li>Paste it in the SQL Editor and click <strong>Run</strong></li>
                  </ol>
                  <div className="flex space-x-3 mt-3">
                    <button 
                      onClick={() => setStep(1)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      ← Previous
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <p className="text-blue-700 text-sm">
                    <strong>Test the Application:</strong>
                  </p>
                  <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside ml-4">
                    <li>Go back to the <Link href="/" className="underline text-blue-800">Main App</Link></li>
                    <li>Try creating a new account</li>
                    <li>You should now be able to sign up without the 500 error</li>
                    <li>Create some notes to test the full functionality</li>
                  </ol>
                  <div className="flex space-x-3 mt-3">
                    <button 
                      onClick={() => setStep(2)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      ← Previous
                    </button>
                    <Link 
                      href="/"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
                    >
                      Test App Now! →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-yellow-900 mb-2">💡 Why This Happens</h3>
              <p className="text-yellow-700 text-sm">
                By default, Supabase enables email confirmation for security. However, without an email 
                provider (like SendGrid, Mailgun, etc.), the signup process fails with a 500 error. 
                For development, we disable email confirmation to allow immediate user registration.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-green-900 mb-2">✅ After the Fix</h3>
              <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
                <li>Users can sign up immediately without email confirmation</li>
                <li>No more 500 errors during registration</li>
                <li>Full notes app functionality will work</li>
                <li>Data will be properly saved to Supabase database</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
