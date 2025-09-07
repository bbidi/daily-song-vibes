
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import AuthScreen from '@/components/AuthScreen';
import Feed from '@/components/Feed';
import PostSong from '@/components/PostSong';
import Profile from '@/components/Profile';
import Messages from '@/components/Messages';
import Chat from '@/components/Chat';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [currentTab, setCurrentTab] = useState('feed');
  const [selectedConversation, setSelectedConversation] = useState<{id: string, name: string} | null>(null);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const handleConversationSelect = (conversationId: string, recipientName: string) => {
    setSelectedConversation({ id: conversationId, name: recipientName });
  };

  const handleBackFromChat = () => {
    setSelectedConversation(null);
  };

  const renderContent = () => {
    if (currentTab === 'messages') {
      if (selectedConversation) {
        return (
          <Chat 
            conversationId={selectedConversation.id}
            recipientName={selectedConversation.name}
            onBack={handleBackFromChat}
          />
        );
      }
      return (
        <Messages 
          onTabChange={setCurrentTab}
          onConversationSelect={handleConversationSelect}
        />
      );
    }

    switch (currentTab) {
      case 'feed':
        return <Feed />;
      case 'post':
        return <PostSong />;
      case 'profile':
        return <Profile />;
      default:
        return <Feed />;
    }
  };

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
