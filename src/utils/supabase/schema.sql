-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.breakouts;

-- Create the breakouts table with proper constraints
CREATE TABLE public.breakouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.Users(id),
    account_id TEXT NOT NULL,
    meeting_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    joining_breakout BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(account_id, meeting_id)
);

-- Create indexes for better query performance
CREATE INDEX breakouts_user_id_idx ON public.breakouts(user_id);
CREATE INDEX breakouts_account_meeting_idx ON public.breakouts(account_id, meeting_id);

-- Enable RLS
ALTER TABLE public.breakouts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.breakouts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.breakouts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.breakouts
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.breakouts
    FOR DELETE USING (true);