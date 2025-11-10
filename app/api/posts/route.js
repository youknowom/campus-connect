import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error.message 
      : "Failed to fetch posts";
    return NextResponse.json(
      { 
        error: "Failed to fetch posts", 
        details: errorMessage,
        hint: process.env.NODE_ENV === "development" 
          ? "Check if DATABASE_URL is set and database is running. Run 'npx prisma generate' and 'npx prisma migrate dev' if needed."
          : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

    // Create user record if not in DB yet
    let dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          name: user.fullName || user.firstName || "Anonymous",
          email: user.emailAddresses[0]?.emailAddress || `${userId}@example.com`,
          image: user.imageUrl,
        },
      });
    }

    const formData = await req.formData();
    const content = formData.get("content")?.toString() || "";
    const imageFile = formData.get("image");

    if (!content.trim() && !imageFile) {
      return NextResponse.json({ error: "Content or image is required" }, { status: 400 });
    }

    let imageUrl = null;

    // Handle image upload
    if (imageFile && imageFile instanceof File) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${imageFile.name}`;
      const filepath = path.join(uploadsDir, filename);

      // Write file
      await writeFile(filepath, buffer);

      // Store URL path
      imageUrl = `/uploads/${filename}`;
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        imageUrl,
        authorId: dbUser.id,
      },
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
