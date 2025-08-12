# Supabase Setup Guide for Notes Application

This guide will help you set up Supabase as the database backend for your notes application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up/login
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Notes App (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Wait for the project to be initialized (this takes a few minutes)

## Step 2: Set up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Create a new query
3. Copy the entire contents of the `database/schema.sql` file
4. Paste it into the SQL Editor
5. Click **Run** to execute the SQL commands

This will create:
- `users` table for user accounts
- `notes` table for storing notes
- Indexes for better performance
- Row Level Security (RLS) policies for data protection
- Triggers for automatic timestamp updates

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 4: Configure Environment Variables

1. In your project root, copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   # JWT Secret for token signing (change this in production!)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # Development/Production Mode
   NODE_ENV=development

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Replace:
   - `https://your-project-ref.supabase.co` with your actual Project URL
   - `your-anon-key-here` with your actual Anon/Public Key

## Step 5: Test the Connection

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)
3. Try creating a new account and adding a note
4. Check your Supabase dashboard → **Table Editor** to see the data

## Step 6: (Optional) Migrate Existing Data

If you have existing data in JSON files, you can migrate it:

1. Make sure your Supabase credentials are set up correctly
2. Run the migration script:
   ```bash
   node database/migrate.js
   ```

This will transfer any existing users and notes from your JSON files to Supabase.

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure `.env.local` exists in your project root
- Verify that the environment variable names are exactly:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your development server after making changes

### Database Connection Issues
- Check that your Supabase project is fully initialized
- Verify your Project URL and Anon Key are correct
- Make sure the database schema has been set up correctly

### RLS (Row Level Security) Issues
- Ensure you've run the complete schema.sql file
- Check that RLS policies are enabled in your Supabase dashboard
- Verify that your JWT tokens include the correct user ID

## Security Features

Your Supabase setup includes:

1. **Row Level Security (RLS)**: Users can only access their own data
2. **JWT Integration**: Seamless authentication with your existing system
3. **Automatic Timestamps**: Created/updated timestamps are managed automatically
4. **Data Validation**: PostgreSQL constraints ensure data integrity

## Next Steps

Once Supabase is set up:
- Your notes will be stored in a production-ready PostgreSQL database
- Data is automatically backed up and secured
- You can use Supabase's real-time features for live updates
- Easy to scale as your application grows

For more advanced features, check out:
- [Supabase Real-time](https://supabase.com/docs/guides/realtime)
- [Supabase Storage](https://supabase.com/docs/guides/storage) for file uploads
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions) for serverless logic
