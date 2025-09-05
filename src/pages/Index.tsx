
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import AuthScreen from '@/components/AuthScreen';
import Feed from '@/components/Feed';
import PostSong from '@/components/PostSong';
import Profile from '@/components/Profile';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('feed');

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

  const renderContent = () => {
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
