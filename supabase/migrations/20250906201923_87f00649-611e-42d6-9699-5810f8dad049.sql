-- Add image_url column to songs table for album cover images
ALTER TABLE public.songs 
ADD COLUMN image_url TEXT;