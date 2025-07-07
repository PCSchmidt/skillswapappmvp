/**
 * Feedback Analytics Component
 * 
 * Simple analytics dashboard for viewing collected feedback during testing.
 * Access at /admin/feedback (for development/testing purposes)
 */

'use client';

import { MessageCircle, Bug, Lightbulb, Heart, TrendingUp, Calendar, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';

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
  { id: 'bug', label: 'Bug Reports', icon: Bug, color: 'text-red-500' },
  { id: 'suggestion', label: 'Suggestions', icon: Lightbulb, color: 'text-yellow-500' },
  { id: 'compliment', label: 'Compliments', icon: Heart, color: 'text-green-500' },
  { id: 'general', label: 'General Feedback', icon: MessageCircle, color: 'text-blue-500' }
];

export default function FeedbackAnalytics() {
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    // Load feedback from localStorage
    const loadFeedback = () => {
      try {
        const stored = localStorage.getItem('skillswap_feedback');
        if (stored) {
          const parsed = JSON.parse(stored);
          setFeedback(parsed.sort((a: FeedbackData, b: FeedbackData) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ));
        }
      } catch (error) {
        console.error('Error loading feedback:', error);
      }
    };

    loadFeedback();

    // Refresh every 30 seconds to pick up new feedback
    const interval = setInterval(loadFeedback, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredFeedback = selectedType === 'all' 
    ? feedback 
    : feedback.filter(item => item.type === selectedType);

  const stats = FEEDBACK_TYPES.reduce((acc, type) => {
    acc[type.id] = feedback.filter(item => item.type === type.id).length;
    return acc;
  }, {} as Record<string, number>);

  const pageStats = feedback.reduce((acc, item) => {
    acc[item.page] = (acc[item.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPages = Object.entries(pageStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Feedback Analytics
          </h1>
          <p className="text-gray-600">
            Real-time feedback from SkillSwap test users
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
              </div>
            </div>
          </Card>

          {FEEDBACK_TYPES.map(({ id, label, icon: Icon, color }) => (
            <Card key={id} className="p-6">
              <div className="flex items-center">
                <Icon className={`w-8 h-8 ${color} mr-3`} />
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats[id] || 0}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Feedback
                </h2>
                
                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      selectedType === 'all'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {FEEDBACK_TYPES.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedType(id)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        selectedType === id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredFeedback.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No feedback yet. Encourage users to share their thoughts!</p>
                  </div>
                ) : (
                  filteredFeedback.map((item, index) => {
                    const typeInfo = FEEDBACK_TYPES.find(t => t.id === item.type);
                    const Icon = typeInfo?.icon || MessageCircle;
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-1 ${typeInfo?.color || 'text-gray-500'}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.type === 'bug' ? 'bg-red-100 text-red-700' :
                                item.type === 'suggestion' ? 'bg-yellow-100 text-yellow-700' :
                                item.type === 'compliment' ? 'bg-green-100 text-green-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {typeInfo?.label || 'General'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {item.page}
                              </span>
                            </div>
                            
                            <p className="text-gray-900 mb-2">{item.message}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(item.timestamp)}
                              </div>
                              {item.userId && (
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  User ID: {item.userId.slice(0, 8)}...
                                </div>
                              )}
                              <span>
                                {getBrowserInfo(item.userAgent)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Page Analytics */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Pages with Feedback
              </h3>
              <div className="space-y-3">
                {topPages.length === 0 ? (
                  <p className="text-gray-500 text-sm">No data yet</p>
                ) : (
                  topPages.map(([page, count]) => (
                    <div key={page} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate">{page}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Testing Tips
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Encourage users to use the feedback widget</li>
                <li>• Focus on bug reports and suggestions first</li>
                <li>• Look for patterns in page-specific feedback</li>
                <li>• Respond to critical issues within 24 hours</li>
                <li>• Export data periodically for deeper analysis</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Export Data
              </h3>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(feedback, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `skillswap-feedback-${new Date().toISOString().split('T')[0]}.json`;
                  link.click();
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
              >
                Download JSON
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
