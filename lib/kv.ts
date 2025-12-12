import { kv } from "@vercel/kv";

// Fallback in-memory store for development/testing without KV
const memoryStore: {
  likes: Record<string, number>;
  userVotes: Record<string, string | null>;
} = {
  likes: { jom: 0, ten: 0, gino: 0, pao: 0 },
  userVotes: {},
};

export async function getLikes(): Promise<Record<string, number>> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const likes = await kv.get<Record<string, number>>("likes");
      return likes || { jom: 0, ten: 0, gino: 0, pao: 0 };
    }
  } catch (error) {
    console.error("KV error, using memory store:", error);
  }
  return memoryStore.likes;
}

export async function setLikes(likes: Record<string, number>): Promise<void> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set("likes", likes);
      return;
    }
  } catch (error) {
    console.error("KV error, using memory store:", error);
  }
  memoryStore.likes = likes;
}

export async function getUserVote(userId: string): Promise<string | null> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const userVotes = await kv.get<Record<string, string | null>>(
        "userVotes"
      );
      return userVotes?.[userId] || null;
    }
  } catch (error) {
    console.error("KV error, using memory store:", error);
  }
  return memoryStore.userVotes[userId] || null;
}

export async function setUserVote(
  userId: string,
  contestantId: string | null
): Promise<void> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const userVotes =
        (await kv.get<Record<string, string | null>>("userVotes")) || {};
      userVotes[userId] = contestantId;
      await kv.set("userVotes", userVotes);
      return;
    }
  } catch (error) {
    console.error("KV error, using memory store:", error);
  }
  memoryStore.userVotes[userId] = contestantId;
}
