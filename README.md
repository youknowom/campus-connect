# Campus Connect

A Reddit-style social platform for campus communities built with Next.js, Clerk authentication, and Prisma.

## Features

- 🔐 **Authentication**: Secure sign-in/sign-up using Clerk
- 📝 **Posts**: Create text and image posts
- 💬 **Comments**: Reply to posts with threaded discussions
- ⬆️ **Voting**: Upvote and downvote posts
- 🎨 **Modern UI**: Beautiful Reddit-like interface with dark mode support
- 📱 **Responsive**: Works on all devices

## Tech Stack

- **Next.js 16** - React framework
- **Clerk** - Authentication
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Clerk account (for authentication)

### Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/campus_connect"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

3. **Set up the database:**

```bash
npx prisma generate
npx prisma migrate dev
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - React components (PostCard, PostForm, CommentSection, etc.)
- `lib/` - Utility functions (Prisma client)
- `prisma/` - Database schema and migrations
- `public/` - Static assets and uploaded images

## Features Overview

### Authentication
- Sign in/Sign up with Clerk
- Protected routes using middleware
- User profiles with avatars

### Posts
- Create text posts
- Upload images with posts
- View all posts in a feed
- Vote on posts (upvote/downvote)
- Comment on posts

### Comments
- Reply to posts
- View all comments for a post
- Real-time comment updates

## Database Schema

- **User**: Stores user information from Clerk
- **Post**: Posts with text and optional images
- **Comment**: Comments on posts
- **Vote**: User votes on posts

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables
4. Deploy!

Make sure to set up your database (e.g., using Vercel Postgres or another provider) and configure Clerk for production.
