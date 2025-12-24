# PocketBase Setup

This directory contains the PocketBase backend for the Trip Planner application.

## Getting Started

### 1. Start PocketBase Server

```bash
cd pocketbase
./pocketbase serve
```

The admin UI will be available at: http://127.0.0.1:8090/_/

### 2. Initial Setup

1. Open http://127.0.0.1:8090/_/ in your browser
2. Create an admin account on first run
3. The collections will be created automatically via the application

### 3. Database Collections

The following collections are used in the application:

- **users** (built-in) - User accounts with authentication
- **trips** - Trip information
- **trip_participants** - Users participating in trips
- **locations** - Trip destinations
- **expenses** - Trip expenses and cost splitting
- **schedule_events** - Trip schedule and activities
- **documents** - Trip documents and files
- **messages** - Chat messages for trips

### 4. Environment Variables

Make sure to set the following environment variable in your React app:

```
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### 5. Data Directory

PocketBase stores data in the `pb_data` directory. This directory is gitignored to prevent committing sensitive data.

## Development

- PocketBase runs on port 8090 by default
- The React app runs on port 5173 (Vite default)
- CORS is automatically handled by PocketBase

## Production

For production deployment:

1. Set up a proper PocketBase server with SSL
2. Update the VITE_POCKETBASE_URL to your production URL
3. Secure the admin panel
4. Set up regular backups of the pb_data directory
