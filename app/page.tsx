"use client";

import { useEffect, useState, useCallback } from "react";
import { ContestantCard } from "@/components/ContestantCard";
import { ContestantId } from "@/types";

const CONTESTANTS: ContestantId[] = ["jom", "ten", "gino", "pao"];
const CONTESTANT_NAMES: Record<ContestantId, string> = {
  jom: "Jom",
  ten: "Ten",
  gino: "Gino",
  pao: "Pao",
};

const CONTESTANT_IMAGES: Record<ContestantId, string> = {
  jom: "/images/jom.png",
  ten: "/images/ten.png",
  gino: "/images/gino.png",
  pao: "/images/pao.png",
};

export default function Home() {
  const [likes, setLikes] = useState<Record<ContestantId, number>>({
    jom: 0,
    ten: 0,
    gino: 0,
    pao: 0,
  });
  const [currentVote, setCurrentVote] = useState<ContestantId | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId] = useState(() => {
    // Generate or retrieve user ID from localStorage
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("userId");
      if (!id) {
        id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("userId", id);
      }
      return id;
    }
    return "";
  });
  const [loading, setLoading] = useState(true);

  // Check for admin mode via URL parameter or localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const adminParam = urlParams.get("admin");

      if (adminParam === "true") {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
      } else {
        const storedAdmin = localStorage.getItem("isAdmin");
        setIsAdmin(storedAdmin === "true");
      }
    }
  }, []);

  const fetchLikes = useCallback(async () => {
    try {
      const response = await fetch("/api/likes");
      const data = await response.json();
      if (data.likes) {
        setLikes(data.likes);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
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
      console.error("Error fetching user vote:", error);
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
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, contestantId }),
      });

      const data = await response.json();
      if (data.likes) {
        setLikes(data.likes);
        setCurrentVote(data.currentVote);
      }
    } catch (error) {
      console.error("Error liking contestant:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(`/api/likes?userId=${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.likes) {
        setLikes(data.likes);
        setCurrentVote(null);
      }
    } catch (error) {
      console.error("Error unliking contestant:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "#ff8c00",
          fontSize: "1.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        🎃 Loading...
      </div>
    );
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#ff8c00",
          fontSize: "3.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          textShadow:
            "0 0 20px rgba(255, 140, 0, 0.5), 0 0 40px rgba(255, 140, 0, 0.3), 3px 3px 6px rgba(0,0,0,0.8)",
          fontFamily: "serif",
          letterSpacing: "2px",
        }}
      >
        🎃 เท้คมีเอ๊า 🎃
      </h1>

      {isAdmin && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            padding: "1rem",
            backgroundColor: "rgba(255, 140, 0, 0.2)",
            borderRadius: "12px",
            border: "2px solid #ff8c00",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              color: "#ff8c00",
              fontSize: "1.1rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            👻 ADMIN MODE - Vote Counts Visible 👻
          </div>
          <div style={{ color: "#fff", fontSize: "0.9rem" }}>
            {Object.entries(likes).map(([id, count]) => (
              <span key={id} style={{ margin: "0 0.5rem" }}>
                {CONTESTANT_NAMES[id as ContestantId]}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {CONTESTANTS.map((contestantId) => (
          <ContestantCard
            key={contestantId}
            name={CONTESTANT_NAMES[contestantId]}
            imageUrl={CONTESTANT_IMAGES[contestantId]}
            likes={likes[contestantId] || 0}
            isLiked={currentVote === contestantId}
            showLikes={isAdmin}
            onLike={() => handleLike(contestantId)}
            onUnlike={handleUnlike}
          />
        ))}
      </div>

      {currentVote && (
        <div
          style={{
            textAlign: "center",
            color: "#ff8c00",
            fontSize: "1.2rem",
            padding: "1rem",
            backgroundColor: "rgba(45, 27, 45, 0.8)",
            borderRadius: "12px",
            border: "2px solid #ff8c00",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 20px rgba(255, 140, 0, 0.3)",
          }}
        >
          🎃 You are currently voting for:{" "}
          <strong style={{ color: "#ff8c00" }}>
            {CONTESTANT_NAMES[currentVote]}
          </strong>{" "}
          🎃
        </div>
      )}

      {!isAdmin && (
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.9rem",
          }}
        >
          👻 Vote counts are hidden 👻
        </div>
      )}
    </main>
  );
}
