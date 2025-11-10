# Troubleshooting Guide

## Common Errors

### 500 Error on `/api/posts`

This error typically occurs due to one of the following issues:

#### 1. Database Connection Issue

**Problem:** The database is not connected or `DATABASE_URL` is missing/incorrect.

**Solution:**
1. Check if you have a `.env` file in the root directory
2. Verify `DATABASE_URL` is set correctly:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/campus_connect"
   ```
3. Make sure PostgreSQL is running
4. Test the connection with:
   ```bash
   npx prisma db pull
   ```

#### 2. Prisma Client Not Generated

**Problem:** Prisma client hasn't been generated after schema changes.

**Solution:**
```bash
npx prisma generate
```

#### 3. Database Migrations Not Run

**Problem:** Database tables don't exist because migrations haven't been run.

**Solution:**
```bash
npx prisma migrate dev
```

Or if you want to reset the database:
```bash
npx prisma migrate reset
```

#### 4. Schema Mismatch

**Problem:** The database schema doesn't match the Prisma schema.

**Solution:**
1. Check if migrations are up to date:
   ```bash
   npx prisma migrate status
   ```
2. Create and apply a new migration:
   ```bash
   npx prisma migrate dev --name fix_schema
   ```

### Clerk Development Keys Warning

**Problem:** You see a warning about development keys.

**Solution:**
This is just a warning, not an error. For development, this is fine. For production:
1. Create a production instance in Clerk
2. Update your environment variables with production keys
3. Deploy with production keys

### Check Server Logs

To see the actual error, check your terminal where you're running `npm run dev`. The error details will be logged there.

## Quick Fix Checklist

1. ✅ Database is running (PostgreSQL)
2. ✅ `.env` file exists with `DATABASE_URL`
3. ✅ Clerk keys are set (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`)
4. ✅ Run `npx prisma generate`
5. ✅ Run `npx prisma migrate dev`
6. ✅ Restart the dev server (`npm run dev`)

## Testing Database Connection

You can test if your database is working by running:

```bash
npx prisma studio
```

This will open a GUI where you can view and manage your database.

## Still Having Issues?

1. Check the terminal/console for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure you're using the correct database URL format
4. Ensure PostgreSQL is running and accessible
5. Check that all dependencies are installed: `npm install`

