import React, { useState } from 'react';
import { ChevronLeft, Search, ChevronRight, MessageSquare } from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';

interface MessagesProps {
  onTabChange: (tab: string) => void;
  onConversationSelect: (conversationId: string, recipientName: string) => void;
}

const Messages = ({ onTabChange, onConversationSelect }: MessagesProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations, loading } = useConversations();

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-white">Loading conversations...</div>
      </div>
    );
  }

  const filteredConversations = conversations.filter(conversation =>
    conversation.other_user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.other_user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('feed')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-xl font-semibold text-white flex-1 text-center">Messages</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-4">
        {filteredConversations.length === 0 ? (
          <div className="text-center text-white/60 mt-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white/40" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start messaging by responding to a song post</p>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id, conversation.other_user?.display_name || 'User')}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {conversation.other_user?.display_name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-medium text-sm">
                    {conversation.other_user?.display_name || conversation.other_user?.username || 'Unknown User'}
                  </p>
                  {conversation.last_message && (
                    <p className="text-white/60 text-xs mt-0.5 truncate">
                      {conversation.last_message.content}
                    </p>
                  )}
                  {conversation.last_message && (
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(conversation.last_message.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;