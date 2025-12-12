# Admin Guide - Viewing Vote Counts

## Method 1: Admin Mode in the Web App (Easiest)

1. **Enable Admin Mode:**
   - Visit your website with the query parameter: `?admin=true`
   - Example: `https://your-app.vercel.app?admin=true`
   - This will enable admin mode and save it to localStorage

2. **View Vote Counts:**
   - Once admin mode is enabled, you'll see:
     - A banner at the top showing all vote counts
     - Individual vote counts on each contestant card
   - Regular users will only see "👻 Hidden 👻" instead of numbers

3. **Disable Admin Mode:**
   - Clear localStorage: Open browser console and run:
     ```javascript
     localStorage.removeItem('isAdmin');
     location.reload();
     ```

## Method 2: Check Database Directly (Upstash Console)

1. **Access Upstash Console:**
   - Go to [console.upstash.com](https://console.upstash.com)
   - Sign in with the same account used in Vercel
   - Find your database: `upstash-kv-blue-door`

2. **View Data:**
   - Click on your database
   - Go to the "Data" or "Browser" tab
   - Look for the key: `likes`
   - The value will be a JSON object like:
     ```json
     {
       "jom": 25,
       "ten": 30,
       "jino": 20,
       "pao": 15
     }
     ```

3. **View User Votes:**
   - Look for the key: `userVotes`
   - This shows which user voted for which contestant

## Method 3: Using Upstash REST API

You can query the database directly using curl or any HTTP client:

```bash
# Get the API URL and token from Vercel environment variables
# Or from Upstash console → Database → REST API

# Get likes
curl "YOUR_KV_REST_API_URL/likes" \
  -H "Authorization: Bearer YOUR_KV_REST_API_TOKEN"

# Get user votes
curl "YOUR_KV_REST_API_URL/userVotes" \
  -H "Authorization: Bearer YOUR_KV_REST_API_TOKEN"
```

## Method 4: Create an Admin API Endpoint (Optional)

If you want a dedicated admin endpoint, you can create `/app/api/admin/stats/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getLikes, getUserVote } from '@/lib/kv';

export async function GET(request: Request) {
  // Add password protection here
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');
  
  if (password !== 'your-secret-password') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const likes = await getLikes();
  return NextResponse.json({ likes });
}
```

Then visit: `https://your-app.vercel.app/api/admin/stats?password=your-secret-password`

## Quick Access

**For quick access, bookmark this URL:**
```
https://your-app.vercel.app?admin=true
```

This will automatically enable admin mode whenever you visit.

