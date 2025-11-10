# Setup Check - Fixing the 500 Error

## The Error

You're seeing a **500 error** when trying to fetch posts from `/api/posts`. This is most commonly caused by:

1. **Database not connected** - `DATABASE_URL` is missing or incorrect
2. **Prisma client not generated** - Need to run `npx prisma generate`
3. **Database migrations not run** - Need to run `npx prisma migrate dev`
4. **Database tables don't exist** - Migrations need to be applied

## Quick Fix Step

### Step 1: Check Environment Variables

Create or verify your `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/campus_connect"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Important:** Replace the values with your actual:

- PostgreSQL connection string
- Clerk keys from your Clerk dashboard

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

This creates the Prisma client that your API routes use to interact with the database.

### Step 3: Run Database Migrations

```bash
npx prisma migrate dev
```

This creates the database tables (User, Post, Comment, Vote) based on your schema.

### Step 4: Verify Database Connection

You can test if your database is working by opening Prisma Studio:

```bash
npx prisma studio
```

This opens a web interface where you can view your database tables.

### Step 5: Restart Development Server

After making changes, restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then start it again
npm run dev
```

## Checking the Error Details

1. **Check the terminal** where you're running `npm run dev` - the actual error message will be logged there
2. **Check the browser console** - open DevTools (F12) and check the Console tab
3. **Check the Network tab** - see the exact error response from the API

## Common Error Messages

### "Can't reach database server"

- PostgreSQL is not running
- `DATABASE_URL` is incorrect
- Database server is not accessible

**Fix:** Start PostgreSQL and verify the connection string

### "Table 'Post' does not exist"

- Migrations haven't been run
- Database is empty

**Fix:** Run `npx prisma migrate dev`

### "PrismaClient is not generated"

- Prisma client needs to be generated

**Fix:** Run `npx prisma generate`

## About the Clerk Warning

The warning about "development keys" is **not an error**. It's just informing you that you're using development keys. This is fine for local development. For production, you'll need to:

1. Create a production instance in Clerk
2. Use production keys
3. Update your environment variables

## Still Not Working?

1. **Check your terminal** for the exact error message
2. **Verify PostgreSQL is running**:
   - Windows: Check Services
   - Mac/Linux: `pg_isready` or `sudo service postgresql status`
3. **Test database connection**:
   ```bash
   npx prisma db pull
   ```
4. **Check Prisma status**:
   ```bash
   npx prisma migrate status
   ```

## Need Help?

The error details are now logged in:

- **Server console** (terminal where `npm run dev` is running)
- **Browser console** (F12 → Console tab)
- **Network tab** (F12 → Network tab → Click on `/api/posts` request)

Look for the error message and the "hint" field in the error response - it will tell you what to check!
