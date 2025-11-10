import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { userId } = await auth();
    const { postId } = await params;

    // Get all votes for this post
    const votes = await prisma.vote.findMany({
      where: { postId },
    });

    const total = votes.reduce((sum, vote) => sum + vote.value, 0);
    const userVote = userId
      ? votes.find((v) => v.userId === userId)?.value || null
      : null;

    return NextResponse.json({ total, userVote });
  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await params;
    const body = await req.json();
    const { value } = body;

    if (value !== 1 && value !== -1) {
      return NextResponse.json({ error: "Invalid vote value" }, { status: 400 });
    }

    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingVote) {
      // Update existing vote
      const vote = await prisma.vote.update({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        data: { value },
      });
      return NextResponse.json(vote);
    } else {
      // Create new vote
      const vote = await prisma.vote.create({
        data: {
          userId,
          postId,
          value,
        },
      });
      return NextResponse.json(vote);
    }
  } catch (error) {
    console.error("Error creating/updating vote:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await params;

    await prisma.vote.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting vote:", error);
    return NextResponse.json({ error: "Failed to remove vote" }, { status: 500 });
  }
}

