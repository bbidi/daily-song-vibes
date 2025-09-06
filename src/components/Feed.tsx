
import React from 'react';
import { Heart, MessageCircle, ExternalLink, Clock, Music } from 'lucide-react';
import { useSongs } from '@/hooks/useSongs';

interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  platform: 'spotify' | 'apple';
  deepLink: string;
}

interface Post {
  id: string;
  user: {
    name: string;
    initial: string;
    avatar: string;
  };
  song: Song;
  caption?: string;
  timestamp: string;
  likes: number;
}

const Feed = () => {
  const { songs, loading } = useSongs();

  const handleSongTap = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-white">Loading songs...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Today's Music</h2>
        <p className="text-white/60 text-sm">See what your friends are listening to</p>
      </div>

      {songs.map((song) => (
        <div
          key={song.id}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
        >
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">U</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">User</p>
              <div className="flex items-center gap-1 text-white/50 text-xs">
                <Clock className="w-3 h-3" />
                {new Date(song.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Song Card */}
          <div
            onClick={() => handleSongTap(song.spotify_url || song.apple_music_url || song.youtube_url || '')}
            className="bg-white/10 rounded-xl p-3 mb-3 cursor-pointer hover:bg-white/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/10 transition-all flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{song.title}</p>
                <p className="text-white/70 text-sm">{song.artist}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-3 h-3 rounded-full ${
                    song.spotify_url ? 'bg-green-500' : song.apple_music_url ? 'bg-gray-300' : 'bg-red-500'
                  }`} />
                  <span className="text-white/50 text-xs">
                    {song.spotify_url ? 'Spotify' : song.apple_music_url ? 'Apple Music' : 'YouTube'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          {song.description && (
            <p className="text-white/80 text-sm mb-3">{song.description}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-white/60 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center gap-1 text-white/60 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Reply</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
