
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import AuthScreen from '@/components/AuthScreen';
import Feed from '@/components/Feed';
import PostSong from '@/components/PostSong';
import Profile from '@/components/Profile';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('feed');

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
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
