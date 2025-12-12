import { NextRequest, NextResponse } from 'next/server';
import { getUserVote } from '@/lib/kv';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const currentVote = await getUserVote(userId);
    return NextResponse.json({ currentVote });
  } catch (error) {
    console.error('Error fetching user vote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user vote' },
      { status: 500 }
    );
  }
}

