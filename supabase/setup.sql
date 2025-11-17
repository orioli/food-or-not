-- Setup script for Sugar Perception Test database tables
-- Run this in your Lovable Cloud SQL Editor

-- Create table for storing test session results
CREATE TABLE IF NOT EXISTS test_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  total_comparisons integer NOT NULL,
  correct_answers integer NOT NULL,
  accuracy numeric NOT NULL,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Create table for storing individual comparisons
CREATE TABLE IF NOT EXISTS test_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  trial_number integer NOT NULL,
  winner_name text NOT NULL,
  winner_sugar numeric NOT NULL,
  loser_name text NOT NULL,
  loser_sugar numeric NOT NULL,
  is_correct boolean NOT NULL,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_test_sessions_session_id ON test_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_test_comparisons_session_id ON test_comparisons(session_id);

-- Enable Row Level Security
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_comparisons ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public insert (for anonymous recording)
CREATE POLICY "Allow public insert" ON test_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert" ON test_comparisons
  FOR INSERT
  WITH CHECK (true);

-- Optional: Create policies to allow reading data (for admin/analysis)
-- Uncomment these if you want to query the data later
-- CREATE POLICY "Allow public read" ON test_sessions FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON test_comparisons FOR SELECT USING (true);

-- Create table for tracking page visits
CREATE TABLE IF NOT EXISTS page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at);

-- Enable Row Level Security
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public insert and read
CREATE POLICY "Allow public insert" ON page_visits
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON page_visits
  FOR SELECT
  USING (true);
