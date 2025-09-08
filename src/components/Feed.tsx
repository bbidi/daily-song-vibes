
import React from 'react';
import { MessageCircle, ExternalLink, Clock, Music } from 'lucide-react';
import { useSongs } from '@/hooks/useSongs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    <div className="h-full flex flex-col">
      <div className="text-center py-4 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white mb-1">Today's Music</h2>
        <p className="text-white/60 text-sm">See what your friends are listening to</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <Carousel className="w-full max-w-sm">
          <CarouselContent>
            {songs.map((song) => (
              <CarouselItem key={song.id}>
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mx-2">
                  <div className="flex flex-col items-center space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 w-full">
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

                  {/* Large Square Album Cover */}
                  <div className="relative group">
                    <div 
                      onClick={() => handleSongTap(song.spotify_url || song.apple_music_url || song.youtube_url || '')}
                      className="cursor-pointer"
                    >
                      {song.image_url ? (
                        <img
                          src={song.image_url}
                          alt={`${song.title} album cover`}
                          className="w-80 h-80 rounded-2xl object-cover shadow-2xl"
                        />
                      ) : (
                        <div className="w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                          <Music className="w-20 h-20 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 rounded-2xl group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>

                  {/* Song Info */}
                  <div className="text-center space-y-1">
                    <p className="text-white font-semibold text-lg">{song.title}</p>
                    <p className="text-white/70 text-base">{song.artist}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${
                        song.spotify_url ? 'bg-green-500' : song.apple_music_url ? 'bg-gray-300' : 'bg-red-500'
                      }`} />
                      <span className="text-white/50 text-sm">
                        {song.spotify_url ? 'Spotify' : song.apple_music_url ? 'Apple Music' : 'YouTube'}
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  {song.description && (
                    <p className="text-white/80 text-center text-sm max-w-xs">{song.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4">
                    <button className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors px-4 py-2 rounded-full bg-white/5 hover:bg-white/10">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Send DM</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-xl hover:scale-110 transform duration-200">
                        ❤️
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-xl hover:scale-110 transform duration-200">
                        🔥
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-xl hover:scale-110 transform duration-200">
                        😍
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-xl hover:scale-110 transform duration-200">
                        🎵
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white border-white/20 hover:bg-white/10" />
          <CarouselNext className="text-white border-white/20 hover:bg-white/10" />
        </Carousel>
      </div>
    </div>
  );
};

export default Feed;
