# Quick Start Guide - Trip Planner with PocketBase

This guide will help you get the Trip Planner application up and running with PocketBase database and authentication.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Terminal/Command line access

## Setup Steps

### 1. Install Dependencies

```bash
cd trip-planner
npm install
```

### 2. Start PocketBase Server

Open a new terminal window:

```bash
cd pocketbase
./pocketbase serve
```

The PocketBase server will start at `http://127.0.0.1:8090`

**First time setup**: When you first access `http://127.0.0.1:8090/_/`, you'll be prompted to create an admin account.

### 3. Configure Database Collections

You have two options:

#### Option A: Manual Setup (Recommended for learning)

1. Open the PocketBase Admin UI: http://127.0.0.1:8090/_/
2. Login with your admin credentials
3. Follow the detailed instructions in `pocketbase/SETUP_COLLECTIONS.md` to create each collection

#### Option B: Quick Setup (Advanced)

Use the setup script (requires manual completion):

```bash
cd pocketbase
./setup.sh admin@yourdomain.com yourpassword
```

Note: Due to API limitations, you'll still need to complete some collection setup through the Admin UI.

### 4. Configure Environment Variables

```bash
cd trip-planner
cp .env.example .env
```

Make sure `.env` contains:
```
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### 5. Start the React Application

In a new terminal window:

```bash
cd trip-planner
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Create Your First User

1. Navigate to `http://localhost:5173`
2. Click on "Зареєструватися" (Register)
3. Fill in the registration form
4. You'll be automatically logged in

### 7. Create Your First Trip

1. Once logged in, click "Створити подорож" (Create Trip)
2. Fill in the trip details
3. Start planning!

## Architecture Overview

```
┌─────────────────────────────────────┐
│   React Frontend (Port 5173)        │
│   - Authentication UI               │
│   - Trip Management                 │
│   - Real-time Chat                  │
└─────────────┬───────────────────────┘
              │
              │ REST API / WebSocket
              │
┌─────────────▼───────────────────────┐
│   PocketBase (Port 8090)            │
│   - SQLite Database                 │
│   - Authentication                  │
│   - File Storage                    │
│   - Real-time Subscriptions         │
└─────────────────────────────────────┘
```

## Key Features

### Implemented
- ✅ User Registration & Authentication
- ✅ Secure Login with PocketBase
- ✅ Trip Creation & Management
- ✅ Database-backed Trip Storage
- ✅ Participant Management
- ✅ Expense Tracking
- ✅ Schedule Planning
- ✅ Document Upload
- ✅ Real-time Chat (ready for implementation)

### Database Collections
- **users** - User accounts (built-in PocketBase collection)
- **trips** - Trip information
- **trip_participants** - Trip participants and roles
- **locations** - Trip destinations
- **expenses** - Expense tracking and splitting
- **schedule_events** - Trip itinerary
- **documents** - File attachments
- **messages** - Chat messages

## Development

### Running Tests
```bash
cd trip-planner
npm test
```

### Linting
```bash
cd trip-planner
npm run lint
```

### Building for Production
```bash
cd trip-planner
npm run build
```

## Troubleshooting

### PocketBase won't start
- Check if port 8090 is already in use
- Make sure you have execute permissions: `chmod +x pocketbase/pocketbase`

### React app can't connect to PocketBase
- Verify PocketBase is running: `curl http://127.0.0.1:8090/api/health`
- Check your `.env` file has the correct `VITE_POCKETBASE_URL`
- Restart the Vite dev server after changing `.env`

### Collections not found errors
- Make sure you've created all collections in PocketBase Admin UI
- Verify the collection names match exactly (case-sensitive)
- Check the API rules are set correctly

### Authentication errors
- Clear browser localStorage and cookies
- Verify the users collection is properly configured in PocketBase
- Check PocketBase logs: `pocketbase/pb_data/logs.db`

## Production Deployment

For production deployment:

1. **PocketBase**:
   - Deploy PocketBase to a server with a public URL
   - Set up SSL/HTTPS
   - Configure backups for `pb_data` directory
   - Set strong admin password

2. **React App**:
   - Update `.env` with production PocketBase URL
   - Build the app: `npm run build`
   - Deploy `dist` folder to static hosting (Vercel, Netlify, etc.)

3. **Security**:
   - Review and restrict API rules
   - Enable rate limiting
   - Set up monitoring
   - Regular backups

## Support

For issues and questions:
- Check the documentation: `README.md`
- Review PocketBase docs: https://pocketbase.io/docs/
- Check collection setup: `pocketbase/SETUP_COLLECTIONS.md`

## License

MIT
