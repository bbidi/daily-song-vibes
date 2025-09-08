
import React from 'react';
import { Music, User, Home, Plus, MessageSquare } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const Layout = ({ children, currentTab, onTabChange }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg min-h-screen relative">
        {/* Chat Icon */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => onTabChange('messages')}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center backdrop-blur-sm"
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="pb-20">
          {children}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/10">
          <div className="flex justify-around items-center p-4">
            <button
              onClick={() => onTabChange('feed')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                currentTab === 'feed' ? 'text-purple-300 bg-white/10' : 'text-white/60'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Feed</span>
            </button>
            
            <button
              onClick={() => onTabChange('post')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                currentTab === 'post' ? 'text-purple-300 bg-white/10' : 'text-white/60'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs">Post</span>
            </button>
            
            <button
              onClick={() => onTabChange('profile')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                currentTab === 'profile' ? 'text-purple-300 bg-white/10' : 'text-white/60'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
