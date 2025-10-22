# Futball - Setup Guide

## Quick Start (MVP with Mock Data)

The application is pre-configured to run with mock data, so you can preview it immediately without Firebase setup.

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Access the Application

Open your browser and navigate to:

- **URL**: <http://localhost:3000>
- **Auto-redirect**: You'll be automatically redirected to `/dashboard`

### 4. Explore Features

The MVP includes:

#### Dashboard (/)

- Overview statistics (total players, available players, active transfers)
- Top-rated players showcase
- Recent transfer activity

#### Players (/dashboard/players)

- Grid view of all players
- Search by name, team, or nationality
- Filter by position (Forward, Midfielder, Defender, Goalkeeper)
- Filter by status (Available, Contracted, Injured)
- View, Edit, and Delete actions (role-based)

#### Player Detail (/dashboard/players/[id])

- Complete player profile with photo
- Physical stats (height, weight, age)
- Performance metrics (total goals, assists, average rating)
- Match statistics table
- Injury history
- Training session records

#### Transfers (/dashboard/transfers)

- Create new transfer with modal form
- View all transfers with status (Pending, Completed, Cancelled)
- Filter by status
- Approve or cancel pending transfers
- Transfer statistics (pending count, total value)

#### Admin Panel (/dashboard/admin)

- User management table
- Change user roles (Admin, Scout, Coach)
- Role permissions overview

### 5. Mock User

The app runs with a mock admin user:

- **Name**: Admin User
- **Email**: <admin@futball.com>
- **Role**: Admin (full access to all features)

You can switch the mock user in `/lib/mock-data/users.ts` by changing `DEFAULT_MOCK_USER`.

## Mock Data Overview

### 20 Sample Players

- Variety of positions, nationalities, and teams
- Realistic ratings (81-91)
- Different statuses (Available, Contracted, Injured)
- Complete with match stats and training records

### 6 Sample Transfers

- Mix of completed and pending transfers
- Realistic transfer fees
- Various teams involved

### 4 Sample Users

- 1 Admin, 2 Scouts, 1 Coach
- Different permission levels

## Firestore Data Structure

When you're ready to integrate Firebase, here's the data structure:

### Collections

``` txt
/users/{userId}
  - email: string
  - displayName: string
  - role: "admin" | "scout" | "coach"
  - createdAt: timestamp
  - photoURL?: string

/players/{playerId}
  - name: string
  - age: number
  - dateOfBirth: timestamp
  - position: string (indexed)
  - currentTeam: string (indexed)
  - nationality: string
  - height: number
  - weight: number
  - status: "available" | "contracted" | "injured" (indexed)
  - overallRating: number (indexed)
  - imageUrl?: string
  - createdAt: timestamp
  - updatedBy: string

/players/{playerId}/stats/{statId}
  - matchDate: timestamp
  - opponent: string
  - goals: number
  - assists: number
  - minutesPlayed: number
  - rating: number
  - seasonId: string

/players/{playerId}/injuries/{injuryId}
  - type: string
  - startDate: timestamp
  - expectedReturnDate: timestamp
  - status: "active" | "recovered"
  - notes: string

/players/{playerId}/training/{sessionId}
  - date: timestamp
  - type: string
  - performance: number (1-10)
  - notes: string

/transfers/{transferId}
  - playerId: string (indexed)
  - playerName?: string
  - fromTeam: string
  - toTeam: string
  - transferDate: timestamp
  - fee?: number
  - status: "pending" | "completed" | "cancelled"
  - initiatedBy: string
  - createdAt: timestamp
```

### Required Composite Indexes

Create these in Firebase Console > Firestore > Indexes:

1. Collection: `players`
   - Fields: `position` (Ascending), `overallRating` (Descending)

2. Collection: `players`
   - Fields: `status` (Ascending), `overallRating` (Descending)

3. Collection: `transfers`
   - Fields: `playerId` (Ascending), `createdAt` (Descending)

## Connecting Firebase

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (Email/Password and Google)

### Step 2: Get Configuration

1. Project Settings > General > Your apps
2. Click "Web" and register your app
3. Copy the Firebase configuration

### Step 3: Update Environment Variables

Edit `.env.local`:

```env
# Set to false to use real Firebase data
NEXT_PUBLIC_USE_MOCK_DATA=false

# Your Firebase credentials
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123

# For Admin SDK (server-side)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Step 4: Set Up Firestore Security Rules

In Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isScoutOrAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'scout'];
    }
    
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    match /players/{playerId} {
      allow read: if isAuthenticated();
      allow create, update: if isScoutOrAdmin();
      allow delete: if isAdmin();
      
      match /{subcollection}/{document} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated();
      }
    }
    
    match /transfers/{transferId} {
      allow read: if isAuthenticated();
      allow create, update: if isScoutOrAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

### Step 5: Restart Development Server

```bash
npm run dev
```

The app will now use real Firebase data instead of mock data.

## Authentication Implementation

The app includes authentication infrastructure in:

- `/lib/auth/` - Auth utilities and RBAC
- `/middleware.ts` - Route protection
- `/components/auth/` - Auth components

To enable authentication:

1. Uncomment auth checks in `middleware.ts`
2. Create login page at `/app/(auth)/login/page.tsx`
3. Use the auth context from `/lib/auth/auth-context.tsx`

## Role-Based Access Control

### Admin

- **Full Access**: All CRUD operations
- **User Management**: Change user roles
- **Delete Operations**: Can delete players and transfers

### Scout

- **Read/Write**: Players and transfers
- **Initiate Transfers**: Create new transfer records
- **Update Players**: Edit player information

### Coach

- **Read**: All players
- **Training Sessions**: Add and update training data
- **Injuries**: Manage injury records
- **Performance Stats**: View analytics

## Troubleshooting

### Build Errors

```bash
# Clean build
rm -rf .next
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Mock Data Not Loading

Check `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Firebase Connection Issues

1. Verify environment variables are correct
2. Check Firebase project is active
3. Ensure Firestore is enabled
4. Verify security rules are published

## Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Other Platforms

```bash
# Build
npm run build

# Start production server
npm start
```

Ensure all environment variables are set on your hosting platform.

## Next Steps

1. **Import Mock Data to Firestore**: Use the provided mock data as seed data
2. **Enable Authentication**: Implement login/signup flows
3. **Add Image Upload**: Allow uploading player photos to Firebase Storage
4. **Real-time Updates**: Replace static queries with Firestore listeners
5. **Analytics Dashboard**: Add charts using Recharts library
6. **Advanced Search**: Implement Algolia or Typesense for full-text search
7. **Notifications**: Add Firebase Cloud Messaging for updates
8. **Export Features**: Generate PDF reports for transfers and player stats

## Support

- **GitHub Issues**: Report bugs or request features
- **Firebase Docs**: <https://firebase.google.com/docs>
- **Next.js Docs**: <https://nextjs.org/docs>

---

Built with ❤️ using Next.js 14, Firebase, and Tailwind CSS
