# Take Me Out - Voting Website

A real-time voting website similar to the game show "Take Me Out" where users can vote for their favorite contestants.

## Features

- 4 contestants: Jom, Ten, Jino, Pao
- Real-time like counts that update every 2 seconds
- Each user can like one contestant at a time
- Users can remove their like and switch to another contestant
- Beautiful, modern UI with gradient backgrounds and smooth animations

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Vercel KV** - Serverless Redis for data storage (with in-memory fallback)
- **Vercel** - Deployment platform

## Backend Requirements

**Yes, you need a backend** for this application because:

1. **Shared State**: Multiple users need to see the same vote counts
2. **Data Persistence**: Votes need to be stored and retrieved across sessions
3. **Concurrency**: Handle multiple users voting simultaneously

The app uses **Vercel KV** (serverless Redis) which is perfect for this use case:
- Free tier available
- Scales automatically
- Works seamlessly with Vercel
- Fast and reliable

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

**Note:** Without Vercel KV credentials, the app will use an in-memory store that resets on server restart. This is fine for local testing but won't work across multiple users.

## Deployment to Vercel

### Option 1: Deploy with Vercel KV (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Set up Vercel KV:**
   - In your Vercel project dashboard, go to the "Storage" tab
   - Click "Create Database" → Select "KV"
   - This will automatically add the required environment variables:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
   - Redeploy your application

4. **Your app is live!** 🎉

### Option 2: Deploy without Vercel KV (One-time use, limited)

If you want to test without setting up KV, the app will use an in-memory store. However:
- ❌ Data resets on server restart
- ❌ Not suitable for production
- ✅ Works for quick testing

## How It Works

1. **User Identification**: Each user gets a unique ID stored in localStorage
2. **Voting**: When a user likes a contestant:
   - If they previously liked someone else, that like is removed
   - The new contestant's like count increases
3. **Real-time Updates**: The app polls the API every 2 seconds to get updated counts
4. **Data Storage**: 
   - Production: Vercel KV (persistent Redis)
   - Development: In-memory store (resets on restart)

## API Endpoints

- `GET /api/likes` - Get current like counts for all contestants
- `POST /api/likes` - Like a contestant (requires `userId` and `contestantId`)
- `DELETE /api/likes?userId=xxx` - Remove user's like
- `GET /api/user-vote?userId=xxx` - Get which contestant a user voted for

## Scaling for 100 Users

The app is designed to handle ~100 concurrent users:

- **Vercel KV**: Can handle thousands of requests per second
- **Next.js API Routes**: Serverless functions scale automatically
- **Polling Interval**: 2 seconds balances real-time feel with server load
- **No Database Queries**: Simple key-value operations are very fast

For larger scale (1000+ users), consider:
- Reducing polling interval or using WebSockets
- Adding rate limiting
- Using a more robust database

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── likes/
│   │   │   └── route.ts      # Like/unlike endpoints
│   │   └── user-vote/
│   │       └── route.ts      # Get user's current vote
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main voting page
├── components/
│   └── ContestantCard.tsx    # Contestant card component
├── lib/
│   └── kv.ts                 # Vercel KV wrapper with fallback
├── types/
│   └── index.ts              # TypeScript types
└── package.json
```

## Environment Variables

When using Vercel KV, these are automatically set:
- `KV_REST_API_URL` - Your KV database URL
- `KV_REST_API_TOKEN` - Your KV access token

## License

MIT

