import React from 'react';
import type { Skill } from '@/types/supabase';

interface Conversation {
  id: string;
  trade_title: string;
  last_message_at: string;
  last_message: string;
  unread_count: number;
  other_user: { id: string; full_name: string; profile_image_url: string };
  offered_skill: Skill;
  requested_skill: Skill;
}

interface ConversationListProps {
  conversations?: Conversation[];
  activeTradeId?: string;
  isLoading?: boolean;
  onConversationSelect?: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = () => <div>ConversationList placeholder</div>;
export default ConversationList;
