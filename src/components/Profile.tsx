
import React, { useState } from 'react';
import { Calendar, Music, Users, Settings, UserPlus, Search, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/hooks/useProfile';
import { useSongs } from '@/hooks/useSongs';
import { useFriendships } from '@/hooks/useFriendships';
import { useAuth } from '@/hooks/useAuth';

interface SongHistory {
  date: string;
  song: {
    title: string;
    artist: string;
    albumCover: string;
  };
  caption?: string;
}

interface ProfileProps {
  onTabChange: (tab: string) => void;
}

const Profile = ({ onTabChange }: ProfileProps) => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchFriend, setSearchFriend] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { userSongs, loading: songsLoading } = useSongs();
  const { friends, pendingRequests, sendFriendRequest, respondToFriendRequest, searchUsers, loading: friendsLoading } = useFriendships();

  const handleSearch = async () => {
    if (searchFriend.trim()) {
      const results = await searchUsers(searchFriend);
      setSearchResults(results);
    }
  };

  const handleSendFriendRequest = async (userId: string) => {
    await sendFriendRequest(userId);
    setSearchResults([]);
    setSearchFriend('');
  };

  if (profileLoading || songsLoading || friendsLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="p-4">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">{initial}</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">{displayName}</h2>
        
        <div className="flex justify-center gap-6 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{friends.length}</p>
            <p className="text-white/60 text-sm">Friends</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{userSongs.length}</p>
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
            onClick={() => onTabChange('settings')}
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

      {/* Pending Friend Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Friend Requests</h3>
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">U</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">User</p>
                  <p className="text-white/60 text-xs">Wants to be friends</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => respondToFriendRequest(request.id, true)}
                    className="bg-green-600 hover:bg-green-700 text-white p-1 h-8 w-8"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => respondToFriendRequest(request.id, false)}
                    className="border-white/20 text-white hover:bg-white/10 p-1 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="mb-6">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Friends ({friends.length})
        </h3>
        <div className="space-y-2">
          {friends.map((friendship) => (
            <div
              key={friendship.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">F</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Friend</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-white/60 text-xs">Friends</span>
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
          {userSongs.map((song) => (
            <div
              key={song.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{song.title}</p>
                  <p className="text-white/70 text-xs">{song.artist}</p>
                </div>
                <span className="text-white/50 text-xs">
                  {new Date(song.created_at).toLocaleDateString()}
                </span>
              </div>
              {song.description && (
                <p className="text-white/80 text-sm">{song.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
