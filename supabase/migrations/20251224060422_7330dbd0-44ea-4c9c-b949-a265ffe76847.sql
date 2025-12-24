-- Create table for test sessions
CREATE TABLE public.test_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  total_comparisons INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  country TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for individual comparisons
CREATE TABLE public.test_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  trial_number INTEGER NOT NULL,
  winner_name TEXT NOT NULL,
  winner_sugar NUMERIC NOT NULL,
  loser_name TEXT NOT NULL,
  loser_sugar NUMERIC NOT NULL,
  is_correct BOOLEAN NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public inserts (no auth required for this public game)
ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_comparisons ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public game)
CREATE POLICY "Allow public inserts" ON public.test_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.test_comparisons FOR INSERT WITH CHECK (true);

-- Allow reading for analytics (can restrict later if needed)
CREATE POLICY "Allow public reads" ON public.test_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public reads" ON public.test_comparisons FOR SELECT USING (true);