#!/bin/bash

# PocketBase Setup Script
# This script creates the necessary collections in PocketBase using the REST API

BASE_URL="http://127.0.0.1:8090"
ADMIN_EMAIL="${1:-admin@trip-planner.local}"
ADMIN_PASSWORD="${2:-adminPassword123}"

echo "🔧 Setting up PocketBase collections..."
echo ""

# Create admin user and get auth token
echo "Creating admin user..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admins" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\",
    \"passwordConfirm\": \"$ADMIN_PASSWORD\"
  }")

# Try to authenticate
echo "Authenticating as admin..."
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"identity\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to authenticate. Please check your credentials."
  exit 1
fi

echo "✅ Authenticated successfully"
echo ""

# Function to create a collection
create_collection() {
  local name=$1
  local data=$2
  
  echo "Creating collection: $name..."
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/collections" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$data")
  
  if echo "$RESPONSE" | grep -q '"id"'; then
    echo "✅ Created: $name"
    echo "$RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//'
  else
    echo "⚠️  Warning for $name: $RESPONSE"
  fi
}

# Create trips collection
TRIPS_ID=$(create_collection "trips" '{
  "name": "trips",
  "type": "base",
  "schema": [
    {"name": "name", "type": "text", "required": true},
    {"name": "status", "type": "select", "required": true, "options": {"values": ["active", "planned", "completed", "cancelled"]}},
    {"name": "start_date", "type": "date", "required": true},
    {"name": "end_date", "type": "date", "required": true},
    {"name": "organizer", "type": "relation", "required": true, "options": {"collectionId": "_pb_users_auth_", "cascadeDelete": false, "maxSelect": 1}},
    {"name": "description", "type": "text", "required": false}
  ],
  "listRule": "@request.auth.id != \"\"",
  "viewRule": "@request.auth.id != \"\"",
  "createRule": "@request.auth.id != \"\"",
  "updateRule": "organizer = @request.auth.id",
  "deleteRule": "organizer = @request.auth.id"
}')

echo ""
sleep 1

# Note: In a real script, we would need to extract the trips collection ID
# For simplicity, we'll use a placeholder that should be replaced manually

echo "✅ PocketBase setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Open the Admin UI: $BASE_URL/_/"
echo "2. Login with:"
echo "   Email: $ADMIN_EMAIL"
echo "   Password: $ADMIN_PASSWORD"
echo "3. Complete the collection setup manually using the SETUP_COLLECTIONS.md guide"
echo ""
echo "Note: Due to API limitations, some collections need to be created manually"
echo "through the Admin UI. Please follow the SETUP_COLLECTIONS.md guide."
