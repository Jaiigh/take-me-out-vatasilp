import { NextRequest, NextResponse } from 'next/server';
import { getLikes, getUserVote, setLikes, setUserVote } from '@/lib/kv';
import { ContestantId } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const likes = await getLikes();
    return NextResponse.json({ likes });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, contestantId } = body;

    if (!userId || !contestantId) {
      return NextResponse.json(
        { error: 'userId and contestantId are required' },
        { status: 400 }
      );
    }

    if (!['jom', 'ten', 'jino', 'pao'].includes(contestantId)) {
      return NextResponse.json(
        { error: 'Invalid contestantId' },
        { status: 400 }
      );
    }

    // Get current user vote
    const currentVote = await getUserVote(userId);

    // If user already voted for this contestant, do nothing
    if (currentVote === contestantId) {
      const likes = await getLikes();
      return NextResponse.json({ likes, currentVote });
    }

    // Get current likes
    const likes = await getLikes();

    // Remove like from previous contestant if exists
    if (currentVote) {
      likes[currentVote] = Math.max(0, (likes[currentVote] || 0) - 1);
    }

    // Add like to new contestant
    likes[contestantId] = (likes[contestantId] || 0) + 1;

    // Save updated likes and user vote
    await setLikes(likes);
    await setUserVote(userId, contestantId);

    return NextResponse.json({ likes, currentVote: contestantId });
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json(
      { error: 'Failed to update like' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get current user vote
    const currentVote = await getUserVote(userId);

    if (!currentVote) {
      const likes = await getLikes();
      return NextResponse.json({ likes, currentVote: null });
    }

    // Get current likes
    const likes = await getLikes();

    // Remove like from contestant
    likes[currentVote] = Math.max(0, (likes[currentVote] || 0) - 1);

    // Save updated likes and clear user vote
    await setLikes(likes);
    await setUserVote(userId, null);

    return NextResponse.json({ likes, currentVote: null });
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json(
      { error: 'Failed to remove like' },
      { status: 500 }
    );
  }
}

