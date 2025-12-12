'use client';

interface ContestantCardProps {
  name: string;
  imageUrl: string;
  likes: number;
  isLiked: boolean;
  showLikes: boolean;
  onLike: () => void;
  onUnlike: () => void;
}

export function ContestantCard({ name, imageUrl, likes, isLiked, showLikes, onLike, onUnlike }: ContestantCardProps) {
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
        backgroundColor: 'rgba(45, 27, 45, 0.9)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: isLiked 
          ? '0 0 30px rgba(255, 140, 0, 0.6), 0 10px 40px rgba(0,0,0,0.5)' 
          : '0 10px 30px rgba(0,0,0,0.5)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        border: isLiked ? '3px solid #ff8c00' : '2px solid rgba(255, 140, 0, 0.3)',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 140, 0, 0.4), 0 15px 50px rgba(0,0,0,0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = isLiked 
          ? '0 0 30px rgba(255, 140, 0, 0.6), 0 10px 40px rgba(0,0,0,0.5)' 
          : '0 10px 30px rgba(0,0,0,0.5)';
      }}
      onClick={handleClick}
    >
      {/* Spooky background overlay when liked */}
      {isLiked && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.15) 0%, rgba(128, 0, 128, 0.15) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255, 140, 0, 0.1) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Contestant Image */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #ff8c00',
              boxShadow: '0 0 20px rgba(255, 140, 0, 0.5)',
              backgroundColor: '#1a0a1a',
            }}
          >
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>

        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#ff8c00',
            textAlign: 'center',
            textShadow: '0 0 10px rgba(255, 140, 0, 0.5), 2px 2px 4px rgba(0,0,0,0.8)',
            fontFamily: 'serif',
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
              filter: isLiked ? 'drop-shadow(0 0 10px rgba(255, 140, 0, 0.8))' : 'none',
              transition: 'filter 0.3s, transform 0.3s',
              transform: isLiked ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            {isLiked ? '🎃' : '👻'}
          </span>
        </div>

        {showLikes && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#ff8c00',
              marginBottom: '1rem',
              textShadow: '0 0 10px rgba(255, 140, 0, 0.5)',
            }}
          >
            {likes} {likes === 1 ? 'vote' : 'votes'}
          </div>
        )}

        {!showLikes && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: '600',
              color: 'rgba(255, 140, 0, 0.5)',
              marginBottom: '1rem',
            }}
          >
            👻 Hidden 👻
          </div>
        )}

        <button
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1a0a1a',
            backgroundColor: isLiked ? '#ff4500' : '#ff8c00',
            border: '2px solid #ff8c00',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.1s, box-shadow 0.2s',
            boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 140, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 140, 0, 0.3)';
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {isLiked ? '👻 Remove Vote' : '🎃 Vote'}
        </button>
      </div>

    </div>
  );
}

