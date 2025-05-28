
import React, { useState } from 'react';
import { Search, Music, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumCover: string;
  platform: 'spotify' | 'apple';
}

const PostSong = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'spotify' | 'apple'>('spotify');

  const mockSearchResults: Song[] = [
    {
      id: '1',
      title: 'Anti-Hero',
      artist: 'Taylor Swift',
      album: 'Midnights',
      albumCover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      platform: 'spotify'
    },
    {
      id: '2',
      title: 'Flowers',
      artist: 'Miley Cyrus',
      album: 'Endless Summer Vacation',
      albumCover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
      platform: 'spotify'
    },
    {
      id: '3',
      title: 'Unholy',
      artist: 'Sam Smith ft. Kim Petras',
      album: 'Gloria',
      albumCover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
      platform: 'apple'
    }
  ];

  const handleSearch = () => {
    console.log(`Searching for: ${searchQuery} on ${selectedPlatform}`);
  };

  const handlePostSong = () => {
    if (selectedSong) {
      console.log('Posting song:', selectedSong, 'with caption:', caption);
      // Reset form
      setSelectedSong(null);
      setCaption('');
      setSearchQuery('');
    }
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Share Today's Song</h2>
        <p className="text-white/60 text-sm">Pick one song to share with your friends</p>
      </div>

      {/* Platform Selection */}
      <div className="mb-6">
        <p className="text-white/80 text-sm mb-3">Choose your music platform:</p>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedPlatform('spotify')}
            className={`flex-1 p-3 rounded-xl border transition-all ${
              selectedPlatform === 'spotify'
                ? 'bg-green-500/20 border-green-400 text-green-300'
                : 'bg-white/5 border-white/20 text-white/60'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              Spotify
            </div>
          </button>
          <button
            onClick={() => setSelectedPlatform('apple')}
            className={`flex-1 p-3 rounded-xl border transition-all ${
              selectedPlatform === 'apple'
                ? 'bg-gray-400/20 border-gray-300 text-gray-200'
                : 'bg-white/5 border-white/20 text-white/60'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              Apple Music
            </div>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a song..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-6">
          <p className="text-white/80 text-sm mb-3">Search results:</p>
          <div className="space-y-2">
            {mockSearchResults
              .filter(song => song.platform === selectedPlatform)
              .map((song) => (
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
                    <img
                      src={song.albumCover}
                      alt={`${song.title} album cover`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
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

      {/* Selected Song */}
      {selectedSong && (
        <div className="mb-6">
          <p className="text-white/80 text-sm mb-3">Selected song:</p>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedSong.albumCover}
                alt={`${selectedSong.title} album cover`}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="text-white font-medium">{selectedSong.title}</p>
                <p className="text-white/70 text-sm">{selectedSong.artist}</p>
                <p className="text-white/50 text-xs">{selectedSong.album}</p>
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
        disabled={!selectedSong}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Share Song
      </Button>
    </div>
  );
};

export default PostSong;
