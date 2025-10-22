# Futball - Football Talent Management Platform

A modern web application built with Next.js 14 and Firebase for managing football talent, tracking performance, and coordinating transfers.

## Features

- **Player Management**: Add, view, edit, and manage football players with detailed profiles
- **Performance Tracking**: Monitor match statistics, training sessions, and injury records
- **Transfer Management**: Initiate and manage player transfers between teams
- **Role-Based Access Control**: Different permissions for Admins, Scouts, and Coaches
- **Real-time Dashboard**: View key metrics and recent activities
- **Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (optional for MVP preview)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3 Run the development server:

```bash
npm run dev
```

4 Open [http://localhost:3000](http://localhost:3000) in your browser

## MVP Preview Mode

The app is currently configured to use **mock data** for immediate preview without Firebase setup. This allows you to explore all features with realistic dummy data.

To enable mock data mode (default):

- The `.env.local` file has `NEXT_PUBLIC_USE_MOCK_DATA=true`

## Firebase Configuration

To use real Firebase data:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database and Authentication
3. Copy your Firebase configuration
4. Update `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5 Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Players collection
    match /players/{playerId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
                               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'scout'];
      allow delete: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Subcollections
      match /{document=**} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
    }
    
    // Transfers collection
    match /transfers/{transferId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
                               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'scout'];
      allow delete: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Required Firestore Indexes

Create these composite indexes in Firebase Console:

1. **players**: `position ASC, overallRating DESC`
2. **players**: `status ASC, overallRating DESC`
3. **transfers**: `playerId ASC, createdAt DESC`

## Project Structure

``` txt
├── app/
│   ├── dashboard/          # Main dashboard routes
│   │   ├── players/        # Players list and detail pages
│   │   ├── transfers/      # Transfer management
│   │   └── admin/          # Admin panel
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── players/            # Player-specific components
│   ├── transfers/          # Transfer-specific components
│   └── shared/             # Shared components
├── lib/
│   ├── mock-data/          # Mock data for MVP
│   ├── firebase/           # Firebase configuration
│   ├── queries/            # Firestore query functions
│   ├── auth/               # Authentication utilities
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## User Roles & Permissions

### Admin

- Full access to all features
- User and role management
- Delete players and transfers
- View all system data

### Scout

- View all players and transfers
- Add and edit players
- Initiate transfers
- Update player information

### Coach

- View all players
- Add training sessions
- Update injury records
- View performance stats

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Security Features

- Input validation with Zod schemas
- Role-based access control (RBAC)
- Session cookies for SSR authentication
- Firestore security rules
- XSS protection via React
- CSRF protection for state-changing operations

## Next Steps

1. **Connect Firebase**: Replace mock data with real Firestore queries
2. **Authentication**: Implement Firebase Auth with email/password and Google sign-in
3. **Image Upload**: Add player photo upload to Firebase Storage
4. **Real-time Updates**: Implement Firestore realtime listeners
5. **Performance Analytics**: Add charts and visualizations with Recharts
6. **Advanced Filtering**: Add more sophisticated search and filter options
7. **Export Features**: Add CSV/PDF export for reports
8. **Notifications**: Implement push notifications for important events

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
