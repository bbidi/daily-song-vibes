import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useFriendships() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFriendships();
    } else {
      setFriends([]);
      setPendingRequests([]);
      setSentRequests([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFriendships = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch all friendships where user is involved
      const { data, error } = await supabase
        .from('friendships')
        .select(`*`)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      if (error) throw error;

      const friendships = (data || []) as Friendship[];
      
      // Separate into categories  
      const accepted = friendships.filter(f => f.status === 'accepted');
      const pending = friendships.filter(f => 
        f.status === 'pending' && f.addressee_id === user.id
      );
      const sent = friendships.filter(f => 
        f.status === 'pending' && f.requester_id === user.id
      );

      setFriends(accepted);
      setPendingRequests(pending);
      setSentRequests(sent);
    } catch (error) {
      console.error('Error fetching friendships:', error);
      toast({
        title: "Error",
        description: "Failed to load friendships",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (addresseeId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('friendships')
        .insert([
          {
            requester_id: user.id,
            addressee_id: addresseeId,
            status: 'pending'
          }
        ])
        .select('*')
        .single();

      if (error) throw error;

      setSentRequests(prev => [data as Friendship, ...prev]);
      
      toast({
        title: "Success",
        description: "Friend request sent!",
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    }
  };

  const respondToFriendRequest = async (friendshipId: string, accept: boolean) => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', friendshipId)
        .select('*')
        .single();

      if (error) throw error;

      // Remove from pending requests
      setPendingRequests(prev => prev.filter(f => f.id !== friendshipId));

      if (accept) {
        // Add to friends list
        setFriends(prev => [data as Friendship, ...prev]);
        toast({
          title: "Success",
          description: "Friend request accepted!",
        });
      } else {
        toast({
          title: "Success",
          description: "Friend request declined",
        });
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
      toast({
        title: "Error",
        description: "Failed to respond to friend request",
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      setFriends(prev => prev.filter(f => f.id !== friendshipId));
      
      toast({
        title: "Success",
        description: "Friend removed",
      });
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: "Error",
        description: "Failed to remove friend",
        variant: "destructive",
      });
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim() || !user) return [];

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  return {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    sendFriendRequest,
    respondToFriendRequest,
    removeFriend,
    searchUsers,
    refetch: fetchFriendships,
  };
}