# PocketBase Collections Setup Guide

This guide will help you set up the required collections in PocketBase for the Trip Planner application.

## Step 1: Start PocketBase

```bash
cd pocketbase
./pocketbase serve
```

Open http://127.0.0.1:8090/_/ and create an admin account.

## Step 2: Enable User Registration

1. Go to Settings > Auth collections > users
2. Check "Email/Password auth"
3. Enable "Allow users to register" (optional, based on your requirements)

## Step 3: Create Collections

Create the following collections with the specified fields:

### 1. trips
- **Type**: Base
- **Fields**:
  - `name` (Text, Required)
  - `status` (Select, Required) - Options: active, planned, completed, cancelled
  - `start_date` (Date, Required)
  - `end_date` (Date, Required)
  - `organizer` (Relation to users, Required, Single)
  - `description` (Text, Optional)
- **API Rules**:
  - List: `@request.auth.id != ""`
  - View: `@request.auth.id != ""`
  - Create: `@request.auth.id != ""`
  - Update: `organizer = @request.auth.id`
  - Delete: `organizer = @request.auth.id`

### 2. trip_participants
- **Type**: Base
- **Fields**:
  - `trip` (Relation to trips, Required, Single, Cascade delete)
  - `user` (Relation to users, Required, Single)
  - `role` (Select, Required) - Options: organizer, participant
- **API Rules**:
  - List: `@request.auth.id != ""`
  - View: `@request.auth.id != ""`
  - Create: `trip.organizer = @request.auth.id`
  - Update: `trip.organizer = @request.auth.id`
  - Delete: `trip.organizer = @request.auth.id`

### 3. locations
- **Type**: Base
- **Fields**:
  - `trip` (Relation to trips, Required, Single, Cascade delete)
  - `name` (Text, Required)
  - `country` (Text, Required)
  - `duration` (Text, Optional)
  - `notes` (Text, Optional)
  - `photos` (File, Optional, Multiple, Max 10 files, Max 5MB each)
  - `order` (Number, Required)
- **API Rules**:
  - List: `@request.auth.id != ""`
  - View: `@request.auth.id != ""`
  - Create: `trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id`
  - Update: `trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id`
  - Delete: `trip.organizer = @request.auth.id`

### 4. expenses
- **Type**: Base
- **Fields**:
  - `trip` (Relation to trips, Required, Single, Cascade delete)
  - `name` (Text, Required)
  - `amount` (Number, Required)
  - `category` (Select, Required) - Options: transport, accommodation, food, entertainment, other
  - `paid_by` (Relation to users, Required, Single)
  - `split_between` (Relation to users, Required, Multiple)
  - `date` (Date, Optional)
- **API Rules**:
  - List: `@request.auth.id != ""`
  - View: `@request.auth.id != ""`
  - Create: `trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id`
  - Update: `paid_by = @request.auth.id || trip.organizer = @request.auth.id`
  - Delete: `paid_by = @request.auth.id || trip.organizer = @request.auth.id`

### 5. schedule_events
- **Type**: Base
- **Fields**:
  - `trip` (Relation to trips, Required, Single, Cascade delete)
  - `date` (Date, Required)
  - `time` (Text, Required)
  - `title` (Text, Required)
  - `description` (Text, Optional)
  - `type` (Select, Required) - Options: transport, accommodation, sightseeing, food, activity, leisure, entertainment, culture, shopping, other
  - `duration` (Text, Optional)
  - `location` (Text, Optional)
- **API Rules**:
  - List: `@request.auth.id != ""`
  - View: `@request.auth.id != ""`
  - Create: `trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id`
  - Update: `trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id`
  - Delete: `trip.organizer = @request.auth.id`

### 6. documents
- **Type**: Base
- **Fields**:
  - `trip` (Relation to trips, Required, Single, Cascade delete)
  - `name` (Text, Required)
  - `category` (Select, Required) - Options: transport, accommodation, insurance, other
  - `file` (File, Required, Single, Max 10MB)
  - `uploaded_by` (Relation to users, Required, Single)
- **API Rules**:
  - List: `@request.auth.id != ""`
  - View: `@request.auth.id != ""`
  - Create: `trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id`
  - Update: `uploaded_by = @request.auth.id || trip.organizer = @request.auth.id`
  - Delete: `uploaded_by = @request.auth.id || trip.organizer = @request.auth.id`

### 7. messages
- **Type**: Base
- **Fields**:
  - `trip` (Relation to trips, Required, Single, Cascade delete)
  - `user` (Relation to users, Required, Single)
  - `message` (Text, Required)
- **API Rules**:
  - List: `@request.auth.id != ""`
  - View: `@request.auth.id != ""`
  - Create: `trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id`
  - Update: `user = @request.auth.id`
  - Delete: `user = @request.auth.id || trip.organizer = @request.auth.id`

## Step 4: Test the Setup

1. Register a test user through the application
2. Try creating a trip
3. Verify that all collections are working properly

## Notes

- Make sure to keep the pb_data directory backed up regularly
- The cascade delete option ensures that when a trip is deleted, all related records are also deleted
- The API rules ensure that only authenticated users can access the data and only owners can modify their data
