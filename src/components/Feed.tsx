
import React from 'react';
import { Heart, MessageCircle, ExternalLink, Clock } from 'lucide-react';

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
  const mockPosts: Post[] = [
    {
      id: '1',
      user: {
        name: 'Alex Johnson',
        initial: 'A',
        avatar: ''
      },
      song: {
        id: '1',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        albumCover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        platform: 'spotify',
        deepLink: 'spotify:track:0VjIjW4GlULA4LGoDOLVZz'
      },
      caption: 'Perfect vibes for this rainy morning ☔️',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: '2',
      user: {
        name: 'Sam Chen',
        initial: 'S',
        avatar: ''
      },
      song: {
        id: '2',
        title: 'Good 4 U',
        artist: 'Olivia Rodrigo',
        albumCover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
        platform: 'apple',
        deepLink: 'music://music.apple.com/track/1565529477'
      },
      caption: 'Can\'t get this out of my head! 🎵',
      timestamp: '5 hours ago',
      likes: 8
    },
    {
      id: '3',
      user: {
        name: 'Jordan Williams',
        initial: 'J',
        avatar: ''
      },
      song: {
        id: '3',
        title: 'Heat Waves',
        artist: 'Glass Animals',
        albumCover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
        platform: 'spotify',
        deepLink: 'spotify:track:02MWAaffLxlfxAUY7c5dvx'
      },
      timestamp: '8 hours ago',
      likes: 15
    }
  ];

  const handleSongTap = (song: Song) => {
    console.log(`Opening ${song.title} on ${song.platform}`);
    // In a real app, this would open the deep link
    window.open(song.deepLink, '_blank');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Today's Music</h2>
        <p className="text-white/60 text-sm">See what your friends are listening to</p>
      </div>

      {mockPosts.map((post) => (
        <div
          key={post.id}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
        >
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{post.user.initial}</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{post.user.name}</p>
              <div className="flex items-center gap-1 text-white/50 text-xs">
                <Clock className="w-3 h-3" />
                {post.timestamp}
              </div>
            </div>
          </div>

          {/* Song Card */}
          <div
            onClick={() => handleSongTap(post.song)}
            className="bg-white/10 rounded-xl p-3 mb-3 cursor-pointer hover:bg-white/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={post.song.albumCover}
                  alt={`${post.song.title} album cover`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/10 transition-all flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{post.song.title}</p>
                <p className="text-white/70 text-sm">{post.song.artist}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-3 h-3 rounded-full ${
                    post.song.platform === 'spotify' ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-white/50 text-xs capitalize">{post.song.platform}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          {post.caption && (
            <p className="text-white/80 text-sm mb-3">{post.caption}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-white/60 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.likes}</span>
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
