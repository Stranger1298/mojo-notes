# Notes Application

A modern, responsive notes application built with Next.js and Supabase. Features user authentication, CRUD operations for notes, persistent storage, and search functionality.

## Features

### Core Features
- **User Authentication**: Secure login and signup system with Supabase Auth
- **Notes Management**: Create, read, update, and delete notes
- **Persistent Storage**: Notes are stored in Supabase PostgreSQL database
- **Real-time Updates**: Instant updates when creating, editing, or deleting notes

### Extra Features (Bonus)
- **Search & Filter**: Search notes by title or content
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with hover effects and smooth transitions
- **Form Validation**: Client-side validation with user-friendly error messages

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 18
- **Styling**: Tailwind CSS for responsive design
- **Authentication**: Supabase Auth with built-in user management
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Storage**: Supabase real-time database
- **Language**: JavaScript (ES6+)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd notes-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create the `notes` table in your Supabase SQL Editor:
   ```sql
   CREATE TABLE notes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users NOT NULL,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
   );

   -- Enable RLS
   ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can only see their own notes" ON notes
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own notes" ON notes
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own notes" ON notes
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own notes" ON notes
     FOR DELETE USING (auth.uid() = user_id);
   ```

4. Configure environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── AuthForm.js
│   └── NotesDashboard.js
├── contexts/
│   └── AuthContext.js
└── lib/
    ├── storage.js
    └── supabase.js
```

## Features in Detail

### Authentication System
- Supabase Auth with built-in user management
- Email/password authentication
- Persistent login state
- Protected routes with Row Level Security

### Notes Management
- Rich text editing capabilities
- Auto-save functionality
- Search across title and content
- Secure user-specific data access

### User Experience
- Responsive grid layout for notes
- Modal-based note editing
- Loading states and error handling
- Confirmation dialogs for destructive actions

## Security Features

- Supabase Auth for secure user authentication
- Row Level Security (RLS) policies for data protection
- User-specific data access controls
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
