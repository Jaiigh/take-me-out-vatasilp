'use client';

import { useEffect, useState, useCallback } from 'react';
import { ContestantCard } from '@/components/ContestantCard';
import { ContestantId } from '@/types';

const CONTESTANTS: ContestantId[] = ['jom', 'ten', 'jino', 'pao'];
const CONTESTANT_NAMES: Record<ContestantId, string> = {
  jom: 'Jom',
  ten: 'Ten',
  jino: 'Jino',
  pao: 'Pao',
};

export default function Home() {
  const [likes, setLikes] = useState<Record<ContestantId, number>>({
    jom: 0,
    ten: 0,
    jino: 0,
    pao: 0,
  });
  const [currentVote, setCurrentVote] = useState<ContestantId | null>(null);
  const [userId] = useState(() => {
    // Generate or retrieve user ID from localStorage
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('userId');
      if (!id) {
        id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('userId', id);
      }
      return id;
    }
    return '';
  });
  const [loading, setLoading] = useState(true);

  const fetchLikes = useCallback(async () => {
    try {
      const response = await fetch('/api/likes');
      const data = await response.json();
      if (data.likes) {
        setLikes(data.likes);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  }, []);

  const fetchUserVote = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/user-vote?userId=${userId}`);
      const data = await response.json();
      if (data.currentVote) {
        setCurrentVote(data.currentVote);
      }
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  }, [userId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchLikes(), fetchUserVote()]);
      setLoading(false);
    };
    loadData();

    // Poll for updates every 2 seconds
    const interval = setInterval(fetchLikes, 2000);
    return () => clearInterval(interval);
  }, [fetchLikes, fetchUserVote]);

  const handleLike = async (contestantId: ContestantId) => {
    if (currentVote === contestantId) {
      // Remove like if clicking the same contestant
      await handleUnlike();
      return;
    }

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, contestantId }),
      });

      const data = await response.json();
      if (data.likes) {
        setLikes(data.likes);
        setCurrentVote(data.currentVote);
      }
    } catch (error) {
      console.error('Error liking contestant:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(`/api/likes?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.likes) {
        setLikes(data.likes);
        setCurrentVote(null);
      }
    } catch (error) {
      console.error('Error unliking contestant:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <h1 style={{
        textAlign: 'center',
        color: 'white',
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '3rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      }}>
        Take Me Out
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem',
      }}>
        {CONTESTANTS.map((contestantId) => (
          <ContestantCard
            key={contestantId}
            name={CONTESTANT_NAMES[contestantId]}
            likes={likes[contestantId] || 0}
            isLiked={currentVote === contestantId}
            onLike={() => handleLike(contestantId)}
            onUnlike={handleUnlike}
          />
        ))}
      </div>

      {currentVote && (
        <div style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '1.2rem',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
        }}>
          You are currently voting for: <strong>{CONTESTANT_NAMES[currentVote]}</strong>
        </div>
      )}
    </main>
  );
}

