-- Create songs table for music posts
CREATE TABLE public.songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  spotify_url TEXT,
  youtube_url TEXT,
  apple_music_url TEXT,
  description TEXT,
  genre TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create friendships table for user relationships
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- Enable RLS on both tables
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Songs policies
CREATE POLICY "Songs are viewable by everyone" 
ON public.songs 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own songs" 
ON public.songs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own songs" 
ON public.songs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own songs" 
ON public.songs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Friendships policies
CREATE POLICY "Users can view friendships they're involved in" 
ON public.friendships 
FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create friend requests" 
ON public.friendships 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're involved in" 
ON public.friendships 
FOR UPDATE 
USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can delete friendships they're involved in" 
ON public.friendships 
FOR DELETE 
USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Add triggers for timestamp updates
CREATE TRIGGER update_songs_updated_at
BEFORE UPDATE ON public.songs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at
BEFORE UPDATE ON public.friendships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_songs_user_id ON public.songs(user_id);
CREATE INDEX idx_songs_created_at ON public.songs(created_at DESC);
CREATE INDEX idx_friendships_requester ON public.friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON public.friendships(addressee_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);