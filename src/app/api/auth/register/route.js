import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Try to create user with regular signup first (without email confirmation)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          display_name: name
        }
      }
    });

    if (error) {
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          { 
            error: 'Too many registration attempts. Please wait a few minutes and try again.',
            code: 'RATE_LIMIT'
          },
          { status: 429 }
        );
      }

      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return NextResponse.json(
          { 
            error: 'An account with this email already exists. Please try logging in instead.',
            code: 'USER_EXISTS'
          },
          { status: 400 }
        );
      }

      console.error('Registration error:', error);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again later.' },
        { status: 500 }
      );
    }

    // If user was created but needs email confirmation
    if (data.user && !data.session) {
      return NextResponse.json({
        message: 'Account created! Please check your email to confirm your account.',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || name
        },
        needsConfirmation: true
      });
    }

    // If user was created and automatically logged in
    return NextResponse.json({
      message: 'Account created successfully!',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
