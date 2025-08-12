# Notes Application

A modern, responsive notes application built with Next.js and JavaScript. Features user authentication, CRUD operations for notes, persistent storage, and search functionality.

## Features

### Core Features
- **User Authentication**: Secure login and signup system with JWT tokens
- **Notes Management**: Create, read, update, and delete notes
- **Persistent Storage**: Notes are stored persistently using file-based storage
- **Real-time Updates**: Instant updates when creating, editing, or deleting notes

### Extra Features (Bonus)
- **Search & Filter**: Search notes by title or content
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with hover effects and smooth transitions
- **Form Validation**: Client-side validation with user-friendly error messages

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 18
- **Styling**: Tailwind CSS for responsive design
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Storage**: Supabase real-time database
- **Language**: JavaScript (ES6+)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

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
   - Run the SQL commands in `database/schema.sql` in your Supabase SQL Editor

4. Configure environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. (Optional) Migrate existing data:
```bash
node database/migrate.js
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Supabase Setup

### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com) and create a new project
- Wait for the project to be fully initialized

### 2. Set up Database Schema
- Go to the SQL Editor in your Supabase dashboard
- Copy and paste the contents of `database/schema.sql`
- Run the SQL commands to create tables and policies

### 3. Get Your Credentials
- Go to Settings > API in your Supabase dashboard
- Copy your Project URL and anon/public key
- Add them to your `.env.local` file

### 4. Configure Row Level Security
The schema includes RLS policies that automatically secure your data:
- Users can only access their own profile data
- Users can only view, create, edit, and delete their own notes

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   └── signup/route.js
│   │   └── notes/
│   │       ├── route.js
│   │       └── [id]/route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── AuthForm.js
│   └── NotesDashboard.js
├── contexts/
│   └── AuthContext.js
├── lib/
│   ├── auth.js
│   ├── storage.js
│   └── supabase.js
└── database/
    ├── schema.sql
    └── migrate.js
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login to existing account

### Notes
- `GET /api/notes` - Get all notes for authenticated user
- `POST /api/notes` - Create a new note
- `GET /api/notes/[id]` - Get a specific note
- `PUT /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note

## Features in Detail

### Authentication System
- Secure password hashing using bcryptjs
- JWT token-based authentication
- Persistent login state using cookies
- Protected routes and API endpoints

### Notes Management
- Rich text editing capabilities
- Auto-save functionality
- Categorization and organization
- Search across title and content

### User Experience
- Responsive grid layout for notes
- Modal-based note editing
- Loading states and error handling
- Confirmation dialogs for destructive actions

## Security Features

- Password hashing with bcryptjs (12 rounds)
- JWT tokens with expiration
- API route protection
- Client-side token storage in HTTP-only cookies
- Input validation and sanitization

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Rich text editor (Quill, TinyMCE)
- Note categories and tags
- Export functionality (PDF, Markdown)
- Collaboration features
- Dark mode support
- Offline support with PWA

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
