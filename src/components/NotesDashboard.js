'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { noteStorage } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function NotesDashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const notes = await noteStorage.getByUserId(user.id);
      setNotes(notes);
    } catch (error) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (editingNote) {
        // Update existing note
        const updatedNote = await noteStorage.update(editingNote.id, {
          title: formData.title,
          content: formData.content,
          updated_at: new Date().toISOString(),
        });

        if (updatedNote) {
          setFormData({ title: '', content: '' });
          setShowForm(false);
          setEditingNote(null);
          setError('');
          await fetchNotes();
        } else {
          setError('Failed to update note');
        }
      } else {
        // Create new note (Supabase will auto-generate UUID)
        const newNote = {
          user_id: user.id,
          title: formData.title,
          content: formData.content,
        };

        const createdNote = await noteStorage.create(newNote);
        if (createdNote) {
          setFormData({ title: '', content: '' });
          setShowForm(false);
          setError('');
          await fetchNotes();
        } else {
          setError('Failed to create note');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error saving note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setLoading(true);
    try {
      const success = await noteStorage.delete(noteId);
      if (success) {
        await fetchNotes();
      } else {
        setError('Failed to delete note');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error deleting note:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setShowForm(false);
    setEditingNote(null);
    setError('');
  };

  const displayName = user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'User');

  return (
  <div className="min-h-screen">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-500/20 via-primary-400/10 to-primary-300/20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight">
              My Notes
            </h1>
              <p className="text-xs mt-1 text-[var(--color-muted)]">
              Welcome back, {user?.user_metadata?.name || user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => setShowForm(true)} className="whitespace-nowrap">
                New
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
          </div>
        </div>
      </header>

  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search and Add Note */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-1">
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
              <Button onClick={() => setShowForm(true)} size="sm">Add</Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="mb-6 text-xs rounded-md px-3 py-2 border border-rose-300 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-700 text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Note Form Modal */}
        <Modal
          open={showForm}
          onClose={resetForm}
          title={editingNote ? 'Edit Note' : 'Add Note'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="A brilliant thought"
              required
            />
            <Textarea
              label="Content"
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your idea here..."
              required
            />
              <div className="flex gap-3 pt-1">
              <Button type="submit" className="flex-1" loading={loading}>
                {editingNote ? 'Update Note' : 'Save Note'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Notes Grid */}
        {loading && !showForm ? (
            <div className="text-center py-12 text-[var(--color-muted)] text-sm">Loading notes…</div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-muted)] text-sm">
              {searchTerm ? 'No matches.' : 'No notes yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => (
              <Card key={note.id} interactive className="flex flex-col">
                <CardHeader className="pb-2 flex gap-2 items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="truncate text-sm font-semibold">
                      {note.title || 'Untitled'}
                    </CardTitle>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[var(--color-muted)]">by {displayName}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleEdit(note)}
                      className="px-2"
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleDelete(note.id)}
                      className="px-2 text-rose-600 hover:text-rose-500"
                    >
                      Del
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <p className="text-sm leading-relaxed line-clamp-4 flex-1">
                    {note.content}
                  </p>
                  <div className="mt-4 text-[11px] tracking-wide uppercase text-foreground/40">
                    {editingNote?.id === note.id ? 'Editing…' : `Updated ${new Date(note.updated_at).toLocaleDateString()}`}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
