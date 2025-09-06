import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Song {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  album: string | null;
  genre: string | null;
  description: string | null;
  spotify_url: string | null;
  youtube_url: string | null;
  apple_music_url: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateSongData {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  description?: string;
  spotify_url?: string;
  youtube_url?: string;
  apple_music_url?: string;
}

export function useSongs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [songs, setSongs] = useState<Song[]>([]);
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserSongs();
    }
  }, [user]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
      toast({
        title: "Error",
        description: "Failed to load songs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSongs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserSongs(data || []);
    } catch (error) {
      console.error('Error fetching user songs:', error);
    }
  };

  const createSong = async (songData: CreateSongData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to share songs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('songs')
        .insert([
          {
            ...songData,
            user_id: user.id,
          }
        ])
        .select('*')
        .single();

      if (error) throw error;

      // Add to both lists
      setSongs(prev => [data as Song, ...prev]);
      setUserSongs(prev => [data as Song, ...prev]);

      toast({
        title: "Success",
        description: "Song shared successfully!",
      });

      return data;
    } catch (error) {
      console.error('Error creating song:', error);
      toast({
        title: "Error",
        description: "Failed to share song",
        variant: "destructive",
      });
    }
  };

  const deleteSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;

      setSongs(prev => prev.filter(song => song.id !== songId));
      setUserSongs(prev => prev.filter(song => song.id !== songId));

      toast({
        title: "Success",
        description: "Song deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting song:', error);
      toast({
        title: "Error",
        description: "Failed to delete song",
        variant: "destructive",
      });
    }
  };

  return {
    songs,
    userSongs,
    loading,
    createSong,
    deleteSong,
    refetch: fetchSongs,
  };
}