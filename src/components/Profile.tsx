
import React, { useState } from 'react';
import { Calendar, Music, Users, Settings, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SongHistory {
  date: string;
  song: {
    title: string;
    artist: string;
    albumCover: string;
  };
  caption?: string;
}

const Profile = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchFriend, setSearchFriend] = useState('');

  const userProfile = {
    name: 'You',
    initial: 'Y',
    friendsCount: 12,
    songsShared: 15
  };

  const songHistory: SongHistory[] = [
    {
      date: 'Today',
      song: {
        title: 'As It Was',
        artist: 'Harry Styles',
        albumCover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
      },
      caption: 'Perfect for this mood 🌅'
    },
    {
      date: 'Yesterday',
      song: {
        title: 'About Damn Time',
        artist: 'Lizzo',
        albumCover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop'
      }
    },
    {
      date: '2 days ago',
      song: {
        title: 'Running Up That Hill',
        artist: 'Kate Bush',
        albumCover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop'
      },
      caption: 'Stranger Things vibes'
    }
  ];

  const friends = [
    { name: 'Alex Johnson', initial: 'A', status: 'active' },
    { name: 'Sam Chen', initial: 'S', status: 'active' },
    { name: 'Jordan Williams', initial: 'J', status: 'inactive' },
    { name: 'Taylor Davis', initial: 'T', status: 'active' }
  ];

  return (
    <div className="p-4">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">{userProfile.initial}</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">{userProfile.name}</h2>
        
        <div className="flex justify-center gap-6 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{userProfile.friendsCount}</p>
            <p className="text-white/60 text-sm">Friends</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{userProfile.songsShared}</p>
            <p className="text-white/60 text-sm">Songs Shared</p>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => setShowAddFriend(!showAddFriend)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friends
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add Friend Section */}
      {showAddFriend && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
          <h3 className="text-white font-medium mb-3">Add Friends</h3>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <Input
                value={searchFriend}
                onChange={(e) => setSearchFriend(e.target.value)}
                placeholder="Search by username or email..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Search
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            <Users className="w-4 h-4 mr-2" />
            Sync from Contacts
          </Button>
        </div>
      )}

      {/* Friends List */}
      <div className="mb-6">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Friends ({userProfile.friendsCount})
        </h3>
        <div className="space-y-2">
          {friends.map((friend, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{friend.initial}</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{friend.name}</p>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    friend.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-white/60 text-xs capitalize">{friend.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Song History */}
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Your Song History
        </h3>
        <div className="space-y-3">
          {songHistory.map((entry, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={entry.song.albumCover}
                  alt={`${entry.song.title} album cover`}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{entry.song.title}</p>
                  <p className="text-white/70 text-xs">{entry.song.artist}</p>
                </div>
                <span className="text-white/50 text-xs">{entry.date}</span>
              </div>
              {entry.caption && (
                <p className="text-white/80 text-sm">{entry.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
