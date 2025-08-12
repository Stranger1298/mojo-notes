// Supabase-based storage with built-in authentication
import { supabase, TABLES } from './supabase';

// Note operations (user auth is handled by Supabase RLS)
export const noteStorage = {
  getByUserId: async (userId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user notes:', error);
      return [];
    }
  },
  
  findById: async (id) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding note by ID:', error);
      return null;
    }
  },
  
  create: async (note) => {
    try {
      console.log('Creating note with data:', note);
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .insert([note])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      console.log('Note created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return null;
    }
  },
  
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  },
  
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from(TABLES.NOTES)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }
};
