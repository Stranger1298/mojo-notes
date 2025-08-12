import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to get authenticated user
async function getAuthenticatedUser(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return { user: null, error: 'No authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: 'Invalid or expired token' };
  }

  return { user, error: null };
}

// Get a specific note
export async function GET(request, { params }) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { id } = await params;
    const { data: note, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ note });

  } catch (error) {
    console.error('Get note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a note
export async function PUT(request, { params }) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { id } = await params;
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const { data: note, error } = await supabase
      .from('notes')
      .update({ title, content })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !note) {
      return NextResponse.json(
        { error: 'Failed to update note or note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ note });

  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a note
export async function DELETE(request, { params }) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { id } = await params;
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete note' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Note deleted successfully' });

  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
