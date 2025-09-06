
import React, { useState } from 'react';
import { Search, Music, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSongs } from '@/hooks/useSongs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  image_url?: string;
  spotify_url?: string;
  preview_url?: string;
}

const PostSong = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [caption, setCaption] = useState('');
  const [customSongData, setCustomSongData] = useState({ title: '', artist: '' });
  const [isPosting, setIsPosting] = useState(false);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { createSong } = useSongs();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('spotify-search', {
        body: { query: searchQuery }
      });

      if (error) throw error;
      
      setSearchResults(data.tracks || []);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for songs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePostSong = async () => {
    let songToPost: Song | null = null;
    
    if (selectedSong) {
      songToPost = selectedSong;
    } else if (customSongData.title && customSongData.artist) {
      songToPost = {
        id: '',
        title: customSongData.title,
        artist: customSongData.artist,
        album: '',
      };
    }
    
    if (!songToPost) {
      toast({
        title: "Error",
        description: "Please select a song or enter song details",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    
    const songData = {
      title: songToPost.title,
      artist: songToPost.artist,
      album: songToPost.album,
      description: caption || undefined,
      spotify_url: songToPost.spotify_url,
    };

    const result = await createSong(songData);
    
    if (result) {
      // Reset form
      setSelectedSong(null);
      setCaption('');
      setSearchQuery('');
      setCustomSongData({ title: '', artist: '' });
      setSearchResults([]);
    }
    
    setIsPosting(false);
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Share Today's Song</h2>
        <p className="text-white/60 text-sm">Search for a song or enter details manually</p>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <p className="text-white/80 text-sm mb-3">Search Spotify:</p>
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs, artists, or albums..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="bg-green-600 hover:bg-green-700 text-white px-4"
          >
            <Search className="w-4 h-4" />
            {isSearching ? '...' : ''}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6">
          <p className="text-white/80 text-sm mb-3">Search results:</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((song) => (
              <div
                key={song.id}
                onClick={() => setSelectedSong(song)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedSong?.id === song.id
                    ? 'bg-purple-500/20 border-purple-400'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {song.image_url ? (
                    <img
                      src={song.image_url}
                      alt={`${song.title} album cover`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{song.title}</p>
                    <p className="text-white/70 text-xs">{song.artist}</p>
                    <p className="text-white/50 text-xs">{song.album}</p>
                  </div>
                  {selectedSong?.id === song.id && (
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Entry */}
      <div className="mb-6">
        <p className="text-white/80 text-sm mb-3">Or enter song details manually:</p>
        <div className="space-y-3">
          <Input
            value={customSongData.title}
            onChange={(e) => setCustomSongData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Song title"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
          <Input
            value={customSongData.artist}
            onChange={(e) => setCustomSongData(prev => ({ ...prev, artist: e.target.value }))}
            placeholder="Artist name"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Song Preview */}
      {(selectedSong || (customSongData.title && customSongData.artist)) && (
        <div className="mb-6">
          <p className="text-white/80 text-sm mb-3">Song to share:</p>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              {selectedSong?.image_url ? (
                <img
                  src={selectedSong.image_url}
                  alt={`${selectedSong.title} album cover`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <p className="text-white font-medium">
                  {selectedSong?.title || customSongData.title}
                </p>
                <p className="text-white/70 text-sm">
                  {selectedSong?.artist || customSongData.artist}
                </p>
                <p className="text-white/50 text-xs">
                  {selectedSong?.album || 'Manual Entry'}
                </p>
                {selectedSong?.preview_url && (
                  <audio 
                    controls 
                    className="mt-2 w-full h-8"
                    style={{ filter: 'invert(1)' }}
                  >
                    <source src={selectedSong.preview_url} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </div>
            
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption (optional)..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Post Button */}
      <Button
        onClick={handlePostSong}
        disabled={(!selectedSong && !(customSongData.title && customSongData.artist)) || isPosting}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4 mr-2" />
        {isPosting ? 'Sharing...' : 'Share Song'}
      </Button>
    </div>
  );
};

export default PostSong;
