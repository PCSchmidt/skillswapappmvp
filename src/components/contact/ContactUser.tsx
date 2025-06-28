/**
 * Contact User Component
 * 
 * Modal/Component that allows users to contact other users for skill swaps.
 * Provides options to send a message, propose a trade, or view profile.
 */

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useSupabase } from '@/contexts/SupabaseContext';

interface ContactUserProps {
  targetUser: {
    id: string;
    full_name?: string | null;
    profile_image_url?: string | null;
    location_city?: string | null;
    location_state?: string | null;
  };
  skill?: {
    id: string;
    title: string;
    is_offering: boolean;
    description?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  triggerButton?: React.ReactNode;
}

export default function ContactUser({ 
  targetUser, 
  skill, 
  isOpen, 
  onClose,
  triggerButton 
}: ContactUserProps) {
  const router = useRouter();
  const { user, supabase } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState<'message' | 'trade'>('message');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!user || !message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a simple message record
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: targetUser.id,
          content: message.trim(),
          trade_id: null, // General contact message, not tied to a specific trade
        });

      if (messageError) throw messageError;

      setSuccess('Message sent successfully!');
      setMessage('');
      
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProposeTradeRedirect = () => {
    // Navigate to trade proposal page with pre-filled data
    const params = new URLSearchParams({
      user_id: targetUser.id,
      ...(skill && { skill_id: skill.id }),
    });
    router.push(`/trades/new?${params.toString()}`);
    onClose();
  };

  const handleViewProfile = () => {
    router.push(`/profile/${targetUser.id}`);
    onClose();
  };

  const getDefaultMessage = useCallback(() => {
    if (!skill) {
      return `Hi ${targetUser.full_name || 'there'}! I saw your profile on SkillSwap and would love to connect with you.`;
    }
    
    const skillAction = skill.is_offering ? 'offering' : 'looking for';
    return `Hi ${targetUser.full_name || 'there'}! I saw that you're ${skillAction} "${skill.title}" on SkillSwap. I'd love to learn more about this skill. Are you available for a skill exchange?`;
  }, [skill, targetUser.full_name]);

  // Set default message when modal opens
  React.useEffect(() => {
    if (isOpen && !message) {
      setMessage(getDefaultMessage());
    }
  }, [isOpen, message, targetUser.full_name, skill]);

  const modalContent = (
    <div className="p-6">
      <div className="flex items-center mb-6">
        {targetUser.profile_image_url ? (
          <Image
            src={targetUser.profile_image_url || '/images/default-avatar.png'}
            alt={targetUser.full_name || 'User'}
            width={48}
            height={48}
            className="rounded-full mr-4"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
            <span className="text-gray-600 font-medium">
              {targetUser.full_name?.charAt(0) || '?'}
            </span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Contact {targetUser.full_name || 'User'}
          </h3>
          {targetUser.location_city && (
            <p className="text-sm text-gray-600">
              {targetUser.location_city}
              {targetUser.location_state && `, ${targetUser.location_state}`}
            </p>
          )}
        </div>
      </div>

      {skill && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border">
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              skill.is_offering ? 'bg-green-500' : 'bg-blue-500'
            }`} />
            <span className="font-medium text-gray-900">
              {skill.title}
            </span>
            <span className="ml-2 text-sm text-gray-600">
              ({skill.is_offering ? 'Teaching' : 'Learning'})
            </span>
          </div>
          {skill.description && (
            <p className="text-sm text-gray-600 mt-2">{skill.description}</p>
          )}
        </div>
      )}

      {/* Contact method selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you like to connect?
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="message"
              checked={contactMethod === 'message'}
              onChange={(e) => setContactMethod(e.target.value as 'message')}
              className="mr-2"
            />
            <span>Send a message</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="trade"
              checked={contactMethod === 'trade'}
              onChange={(e) => setContactMethod(e.target.value as 'trade')}
              className="mr-2"
            />
            <span>Propose a skill trade</span>
          </label>
        </div>
      </div>

      {contactMethod === 'message' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your message..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Be friendly and specific about what you're looking for!
          </p>
        </div>
      )}

      {contactMethod === 'trade' && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            You'll be redirected to create a formal trade proposal where you can specify 
            which skills you'd like to exchange.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          onClick={handleViewProfile}
          variant="outline"
        >
          View Profile
        </Button>
        
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          
          {contactMethod === 'message' ? (
            <Button
              onClick={handleSendMessage}
              variant="primary"
              isLoading={loading}
              disabled={!message.trim()}
            >
              Send Message
            </Button>
          ) : (
            <Button
              onClick={handleProposeTradeRedirect}
              variant="primary"
            >
              Create Trade Proposal
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (triggerButton) {
    return (
      <>
        <div onClick={() => {/* Trigger button should be handled by parent */}}>
          {triggerButton}
        </div>
        <Modal isOpen={isOpen} onClose={onClose} title="">
          {modalContent}
        </Modal>
      </>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      {modalContent}
    </Modal>
  );
}
