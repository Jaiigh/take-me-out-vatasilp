export type ContestantId = 'jom' | 'ten' | 'jino' | 'pao';

export interface Contestant {
  id: ContestantId;
  name: string;
  likes: number;
}

export interface VoteState {
  likes: Record<ContestantId, number>;
  userVotes: Record<string, ContestantId | null>; // userId -> contestantId
}

