/**
 * Feedback Widget Component
 * 
 * In-app feedback collection widget for gathering user feedback during testing.
 * Provides a floating button that opens a feedback form for easy access.
 */

'use client';

import { MessageCircle, X, Send, Bug, Lightbulb, Heart } from 'lucide-react';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useSupabase } from '@/contexts/SupabaseContext';

interface FeedbackData {
  type: 'bug' | 'suggestion' | 'compliment' | 'general';
  message: string;
  page: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  email?: string;
}

const FEEDBACK_TYPES = [
  { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
  { id: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'text-yellow-500' },
  { id: 'compliment', label: 'Compliment', icon: Heart, color: 'text-green-500' },
  { id: 'general', label: 'General Feedback', icon: MessageCircle, color: 'text-blue-500' }
] as const;

export default function FeedbackWidget() {
  const { user } = useSupabase();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<{
    type: 'bug' | 'suggestion' | 'compliment' | 'general';
    message: string;
    email: string;
  }>({
    type: 'general',
    message: '',
    email: user?.email || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        type: formData.type,
        message: formData.message,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        userId: user?.id,
        email: formData.email || undefined
      };

      // For now, log to console and localStorage
      // In production, this would send to an analytics service or database
      console.log('Feedback submitted:', feedbackData);
      
      // Store in localStorage for demo purposes
      const existingFeedback = JSON.parse(localStorage.getItem('skillswap_feedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('skillswap_feedback', JSON.stringify(existingFeedback));

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFormData({
          type: 'general',
          message: '',
          email: user?.email || ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            <span className="font-medium">Thank you for your feedback!</span>
          </div>
          <p className="text-sm mt-1 opacity-90">
            Your input helps us improve SkillSwap.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl border max-w-sm w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900">Share Feedback</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What type of feedback is this?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_TYPES.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: id }))}
                    className={`p-2 text-xs rounded-md border text-left transition-colors ${
                      formData.type === id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Icon className={`w-3 h-3 ${formData.type === id ? 'text-blue-500' : color}`} />
                      <span>{label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 mb-1">
                Your feedback
              </label>
              <textarea
                id="feedback-message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={3}
                placeholder="Tell us what you think..."
                required
              />
            </div>

            {/* Email (for non-logged-in users) */}
            {!user && (
              <div>
                <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="feedback-email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="your@email.com"
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className="w-full"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Feedback
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="px-4 pb-3">
            <p className="text-xs text-gray-500">
              Current page: {typeof window !== 'undefined' ? window.location.pathname : '/'}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Share feedback"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
