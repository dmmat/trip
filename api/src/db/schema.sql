-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  avatar TEXT,
  phone TEXT,
  location TEXT,
  locale TEXT DEFAULT 'uk',
  role TEXT DEFAULT 'user', -- 'user' or 'operator'
  company_name TEXT,
  company_description TEXT,
  email_verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- OAuth providers linked to users
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'google', 'facebook', 'x'
  provider_user_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(provider, provider_user_id)
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Trip participants
CREATE TABLE IF NOT EXISTS trip_participants (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'participant', -- 'organizer' or 'participant'
  joined_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(trip_id, user_id)
);

-- Trip locations
CREATE TABLE IF NOT EXISTS trip_locations (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  country TEXT,
  duration TEXT,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Expenses categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Expense items
CREATE TABLE IF NOT EXISTS expense_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  paid_by TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (paid_by) REFERENCES users(id)
);

-- Expense splits
CREATE TABLE IF NOT EXISTS expense_splits (
  id TEXT PRIMARY KEY,
  expense_item_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (expense_item_id) REFERENCES expense_items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Schedule days
CREATE TABLE IF NOT EXISTS schedule_days (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Schedule events
CREATE TABLE IF NOT EXISTS schedule_events (
  id TEXT PRIMARY KEY,
  day_id TEXT NOT NULL,
  time TEXT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  duration TEXT,
  location TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (day_id) REFERENCES schedule_days(id) ON DELETE CASCADE
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  size TEXT,
  url TEXT,
  uploaded_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Invite links (for both users and operators)
CREATE TABLE IF NOT EXISTS invite_links (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  trip_id TEXT,
  tour_id TEXT,
  created_by TEXT NOT NULL,
  max_uses INTEGER DEFAULT 0, -- 0 = unlimited
  uses INTEGER DEFAULT 0,
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (tour_id) REFERENCES operator_tours(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Operator tours (tours created by operators for clients)
CREATE TABLE IF NOT EXISTS operator_tours (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'completed', 'cancelled'
  start_date TEXT,
  end_date TEXT,
  price REAL DEFAULT 0,
  currency TEXT DEFAULT 'UAH',
  max_participants INTEGER DEFAULT 0,
  tags TEXT, -- JSON array of tags
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (operator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tour locations
CREATE TABLE IF NOT EXISTS tour_locations (
  id TEXT PRIMARY KEY,
  tour_id TEXT NOT NULL,
  name TEXT NOT NULL,
  country TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (tour_id) REFERENCES operator_tours(id) ON DELETE CASCADE
);

-- Tour participants (clients)
CREATE TABLE IF NOT EXISTS tour_participants (
  id TEXT PRIMARY KEY,
  tour_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  amount_paid REAL DEFAULT 0,
  joined_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tour_id) REFERENCES operator_tours(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(tour_id, user_id)
);

-- Operator expenses (costs for running a tour)
CREATE TABLE IF NOT EXISTS tour_expenses (
  id TEXT PRIMARY KEY,
  tour_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'UAH',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tour_id) REFERENCES operator_tours(id) ON DELETE CASCADE
);

-- Integration bookings (tracked bookings from external services)
CREATE TABLE IF NOT EXISTS integration_bookings (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  tour_id TEXT,
  provider TEXT NOT NULL, -- 'booking', 'viator', 'skyscanner', etc.
  external_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'hotel', 'activity', 'flight', 'transfer'
  name TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  price REAL,
  currency TEXT,
  check_in TEXT,
  check_out TEXT,
  metadata TEXT, -- JSON blob with provider-specific data
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
  FOREIGN KEY (tour_id) REFERENCES operator_tours(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_oauth_user ON oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_trip_participants_trip ON trip_participants(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_participants_user ON trip_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_locations_trip ON trip_locations(trip_id);
CREATE INDEX IF NOT EXISTS idx_expense_items_trip ON expense_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_schedule_days_trip ON schedule_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_trip ON chat_messages(trip_id);
CREATE INDEX IF NOT EXISTS idx_documents_trip ON documents(trip_id);
CREATE INDEX IF NOT EXISTS idx_invite_links_code ON invite_links(code);
CREATE INDEX IF NOT EXISTS idx_invite_links_trip ON invite_links(trip_id);
CREATE INDEX IF NOT EXISTS idx_invite_links_tour ON invite_links(tour_id);
CREATE INDEX IF NOT EXISTS idx_operator_tours_operator ON operator_tours(operator_id);
CREATE INDEX IF NOT EXISTS idx_tour_participants_tour ON tour_participants(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_participants_user ON tour_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_expenses_tour ON tour_expenses(tour_id);
CREATE INDEX IF NOT EXISTS idx_integration_bookings_trip ON integration_bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_integration_bookings_tour ON integration_bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
