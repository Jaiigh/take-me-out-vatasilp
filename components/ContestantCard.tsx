'use client';

interface ContestantCardProps {
  name: string;
  likes: number;
  isLiked: boolean;
  onLike: () => void;
  onUnlike: () => void;
}

export function ContestantCard({ name, likes, isLiked, onLike, onUnlike }: ContestantCardProps) {
  const handleClick = () => {
    if (isLiked) {
      onUnlike();
    } else {
      onLike();
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
      }}
      onClick={handleClick}
    >
      {/* Background gradient overlay when liked */}
      {isLiked && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#333',
            textAlign: 'center',
          }}
        >
          {name}
        </h2>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              fontSize: '3rem',
              color: isLiked ? '#667eea' : '#999',
              transition: 'color 0.2s',
            }}
          >
            {isLiked ? '❤️' : '🤍'}
          </span>
        </div>

        <div
          style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#667eea',
          }}
        >
          {likes} {likes === 1 ? 'like' : 'likes'}
        </div>

        <button
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'white',
            backgroundColor: isLiked ? '#ef4444' : '#667eea',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {isLiked ? 'Remove Like' : 'Like'}
        </button>
      </div>
    </div>
  );
}

