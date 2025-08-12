// Data migration script to transfer from JSON files to Supabase
// Run this script after setting up your Supabase database

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../src/lib/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

async function migrateData() {
  try {
    console.log('Starting data migration...');

    // Read existing JSON files
    let users = [];
    let notes = [];

    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      console.log(`Found ${users.length} users to migrate`);
    }

    if (fs.existsSync(NOTES_FILE)) {
      notes = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
      console.log(`Found ${notes.length} notes to migrate`);
    }

    // Migrate users
    if (users.length > 0) {
      const { data: migratedUsers, error: usersError } = await supabase
        .from('users')
        .insert(users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          created_at: user.createdAt
        })));

      if (usersError) {
        console.error('Error migrating users:', usersError);
      } else {
        console.log('✅ Users migrated successfully');
      }
    }

    // Migrate notes
    if (notes.length > 0) {
      const { data: migratedNotes, error: notesError } = await supabase
        .from('notes')
        .insert(notes.map(note => ({
          id: note.id,
          user_id: note.userId,
          title: note.title,
          content: note.content,
          created_at: note.createdAt,
          updated_at: note.updatedAt
        })));

      if (notesError) {
        console.error('Error migrating notes:', notesError);
      } else {
        console.log('✅ Notes migrated successfully');
      }
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
