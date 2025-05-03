/**
 * MessageComposer Component
 * 
 * This component provides an interface for composing and sending messages,
 * including attachment uploads.
 */

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';

interface MessageComposerProps {
  tradeId: string;
  receiverId: string;
  onMessageSent: () => void;
}

export default function MessageComposer({ tradeId, receiverId, onMessageSent }: MessageComposerProps) {
  const { supabase, user } = useSupabase();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle attachment upload
  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    
    setAttachment(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }
  };
  
  // Remove attachment
  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Submit message
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const trimmedMessage = message.trim();
    if (!trimmedMessage && !attachment) return;
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      let attachmentUrl: string | null = null;
      let attachmentType: string | null = null;
      
      // Upload attachment if present
      if (attachment) {
        const fileExt = attachment.name.split('.').pop();
        const fileName = `${tradeId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `message-attachments/${fileName}`;
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from('attachments')
          .upload(filePath, attachment);
        
        if (fileError) {
          throw fileError;
        }
        
        const { data: urlData } = await supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);
        
        attachmentUrl = urlData.publicUrl;
        attachmentType = attachment.type;
      }
      
      // Insert message
      const { error } = await supabase
        .from('messages')
        .insert({
          trade_id: tradeId,
          sender_id: user.id,
          receiver_id: receiverId,
          content: trimmedMessage,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
          is_read: false
        });
      
      if (error) {
        throw error;
      }
      
      // Clear inputs
      setMessage('');
      handleRemoveAttachment();
      
      // Notify parent component
      onMessageSent();
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 p-4">
      {/* Attachment preview */}
      {attachmentPreview && (
        <div className="mb-3 relative">
          <div className="relative w-32 h-32 rounded overflow-hidden border border-gray-200">
            <img src={attachmentPreview} alt="Attachment preview" className="object-cover w-full h-full" />
            <button
              type="button"
              onClick={handleRemoveAttachment}
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90"
              aria-label="Remove attachment"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Message input and actions */}
      <div className="flex items-end space-x-2">
        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none flex-shrink-0"
          disabled={isSubmitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span className="sr-only">Attach file</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAttachmentChange}
            className="hidden"
            accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain"
          />
        </button>
        
        {/* Text input */}
        <div className="flex-grow relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
            disabled={isSubmitting}
          />
        </div>
        
        {/* Send button */}
        <button
          type="submit"
          className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0 disabled:opacity-60"
          disabled={isSubmitting || (!message.trim() && !attachment)}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  );
}
