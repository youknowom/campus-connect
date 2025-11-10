import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { postId } = await params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const { postId } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Ensure user exists in DB
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

    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: dbUser.id,
        postId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

