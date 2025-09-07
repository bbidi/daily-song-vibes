import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ConversationUser {
  id: string;
  display_name?: string;
  username?: string;
  avatar_url?: string;
}

interface LastMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
}

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  other_user?: ConversationUser;
  last_message?: LastMessage;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // First get all conversations the user participates in
      const { data: conversationParticipants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations (
            id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (participantsError) throw participantsError;

      if (!conversationParticipants || conversationParticipants.length === 0) {
        setConversations([]);
        return;
      }

      // Get conversation IDs
      const conversationIds = conversationParticipants.map(cp => cp.conversation_id);

      // Get other participants for each conversation
      const { data: allParticipants, error: allParticipantsError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          user_id
        `)
        .in('conversation_id', conversationIds)
        .neq('user_id', user.id);

      if (allParticipantsError) throw allParticipantsError;

      // Get profiles for other participants
      const otherUserIds = allParticipants?.map(p => p.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, username, avatar_url')
        .in('user_id', otherUserIds);

      if (profilesError) throw profilesError;

      // Get last message for each conversation
      const { data: lastMessages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Group last messages by conversation
      const lastMessagesByConversation = lastMessages?.reduce((acc, message) => {
        if (!acc[message.conversation_id]) {
          acc[message.conversation_id] = message;
        }
        return acc;
      }, {} as Record<string, LastMessage>) || {};

      // Build conversations array
      const conversationsData = conversationParticipants.map(cp => {
        const conversation = cp.conversations;
        const otherParticipant = allParticipants?.find(ap => ap.conversation_id === cp.conversation_id);
        const profile = profiles?.find(p => p.user_id === otherParticipant?.user_id);
        const lastMessage = lastMessagesByConversation[cp.conversation_id];

        return {
          id: conversation.id,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
          other_user: profile ? {
            id: profile.id,
            display_name: profile.display_name,
            username: profile.username,
            avatar_url: profile.avatar_url
          } : undefined,
          last_message: lastMessage
        };
      });

      // Sort by last message time or creation time
      conversationsData.sort((a, b) => {
        const aTime = a.last_message?.created_at || a.created_at;
        const bTime = b.last_message?.created_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      setConversations(conversationsData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  return {
    conversations,
    loading,
    refetch: fetchConversations
  };
};