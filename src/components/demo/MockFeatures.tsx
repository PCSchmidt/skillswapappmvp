'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Video, 
  Phone, 
  MessageSquare, 
  Calendar,
  Shield,
  Zap,
  Clock,
  DollarSign,
  Bell
} from 'lucide-react';

// Reusable mock feature wrapper
export const MockFeature = ({ 
  children, 
  title, 
  description, 
  plannedDate,
  icon: Icon = Zap,
  color = 'amber',
  mockAction
}) => {
  const colorClasses = {
    amber: {
      border: 'border-amber-300',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      textSecondary: 'text-amber-700',
      textTertiary: 'text-amber-600',
      icon: 'text-amber-600'
    },
    blue: {
      border: 'border-blue-300',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      textSecondary: 'text-blue-700',
      textTertiary: 'text-blue-600',
      icon: 'text-blue-600'
    },
    green: {
      border: 'border-green-300',
      bg: 'bg-green-50',
      text: 'text-green-800',
      textSecondary: 'text-green-700',
      textTertiary: 'text-green-600',
      icon: 'text-green-600'
    },
    orange: {
      border: 'border-orange-300',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      textSecondary: 'text-orange-700',
      textTertiary: 'text-orange-600',
      icon: 'text-orange-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`border-2 border-dashed ${colors.border} ${colors.bg} p-6 rounded-lg relative`}>
      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 text-xs font-bold rounded-bl rounded-tr">
        DEMO MODE
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${colors.icon}`} />
        <span className={`font-semibold ${colors.text}`}>{title}</span>
      </div>
      <p className={`text-sm ${colors.textSecondary} mb-4`}>{description}</p>
      {children}
      {plannedDate && (
        <p className={`text-xs ${colors.textTertiary} mt-2 flex items-center gap-1`}>
          <Clock className="w-3 h-3" />
          Planned for: {plannedDate}
        </p>
      )}
    </div>
  );
};

// Payment System Mock
export const PaymentMock = ({ amount = 25, onMockPayment }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMockPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onMockPayment && onMockPayment();
    }, 2000);
  };

  return (
    <MockFeature
      title="Secure Payment Processing"
      description="Integration with Stripe for secure payments. Currently in demo mode for testing."
      plannedDate="Q3 2025"
      icon={CreditCard}
      color="orange"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-white rounded border">
          <span>Skill Exchange Session</span>
          <span className="font-semibold">${amount}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input 
              type="text" 
              placeholder="4242 4242 4242 4242" 
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiry</label>
            <input 
              type="text" 
              placeholder="12/28" 
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
        </div>

        <button 
          onClick={handleMockPayment}
          disabled={isProcessing}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing Demo Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Pay ${amount} (Demo)
            </>
          )}
        </button>
      </div>
    </MockFeature>
  );
};

// Video Call Integration Mock
export const VideoCallMock = ({ onScheduleCall }) => {
  const [isScheduling, setIsScheduling] = useState(false);

  const handleScheduleCall = () => {
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      onScheduleCall && onScheduleCall();
    }, 1500);
  };

  return (
    <MockFeature
      title="Video Call Integration"
      description="Direct integration with Zoom, Google Meet, or Microsoft Teams for seamless video calls."
      plannedDate="Q3 2025"
      icon={Video}
      color="blue"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-white rounded border">
          <Video className="w-8 h-8 text-blue-600" />
          <div>
            <p className="font-medium">Start Video Session</p>
            <p className="text-sm text-gray-600">High-quality video call with screen sharing</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleScheduleCall}
            disabled={isScheduling}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isScheduling ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            Schedule Call
          </button>
          <button className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 p-3 rounded hover:bg-blue-50">
            <Video className="w-4 h-4" />
            Start Now (Demo)
          </button>
        </div>
      </div>
    </MockFeature>
  );
};

// SMS Notifications Mock
export const SMSNotificationMock = ({ message, phoneNumber }) => {
  const [notifications, setNotifications] = useState([]);

  const addMockNotification = (msg) => {
    const notification = {
      id: Date.now(),
      message: msg,
      timestamp: new Date(),
      phone: phoneNumber || '+1 (555) 123-4567'
    };
    setNotifications(prev => [notification, ...prev.slice(0, 2)]);
  };

  return (
    <MockFeature
      title="SMS Notifications"
      description="Automated SMS notifications for important updates using Twilio or similar service."
      plannedDate="Q4 2025"
      icon={MessageSquare}
      color="green"
    >
      <div className="space-y-4">
        <button 
          onClick={() => addMockNotification(message || "Your skill exchange session starts in 15 minutes!")}
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Send Demo SMS
        </button>

        {notifications.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-green-800">Mock SMS Sent:</p>
            {notifications.map(notification => (
              <div key={notification.id} className="bg-white p-3 rounded border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-gray-500">To: {notification.phone}</span>
                  <span className="text-xs text-gray-500">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{notification.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MockFeature>
  );
};

// Trust & Safety Mock
export const TrustSafetyMock = ({ userRating = 4.8, isVerified = false }) => {
  const [verificationStatus, setVerificationStatus] = useState(isVerified ? 'verified' : 'pending');

  const handleMockVerification = () => {
    setVerificationStatus('processing');
    setTimeout(() => {
      setVerificationStatus('verified');
    }, 3000);
  };

  return (
    <MockFeature
      title="Trust & Safety Verification"
      description="ID verification, background checks, and skill certifications for trusted exchanges."
      plannedDate="Q3 2025"
      icon={Shield}
      color="blue"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white rounded border">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${verificationStatus === 'verified' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="font-medium">Verification Status</span>
          </div>
          <span className={`px-2 py-1 rounded text-sm ${
            verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
            verificationStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {verificationStatus === 'verified' ? 'Verified' :
             verificationStatus === 'processing' ? 'Processing...' : 'Pending'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-2xl font-bold text-blue-600">{userRating}</div>
            <div className="text-sm text-gray-600">User Rating</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-gray-600">Exchanges</div>
          </div>
        </div>

        {verificationStatus !== 'verified' && (
          <button 
            onClick={handleMockVerification}
            disabled={verificationStatus === 'processing'}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {verificationStatus === 'processing' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Verifying Identity...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Start Verification (Demo)
              </>
            )}
          </button>
        )}
      </div>
    </MockFeature>
  );
};

// Advanced Analytics Mock
export const AnalyticsMock = () => {
  const mockData = {
    profileViews: 156,
    skillMatches: 42,
    responseRate: 87,
    avgRating: 4.8
  };

  return (
    <MockFeature
      title="Advanced Analytics"
      description="Detailed insights into your profile performance and skill exchange patterns."
      plannedDate="Q4 2025"
      icon={DollarSign}
      color="amber"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-white rounded border">
          <div className="text-2xl font-bold text-purple-600">{mockData.profileViews}</div>
          <div className="text-sm text-gray-600">Profile Views</div>
          <div className="text-xs text-green-600">↑ 23% this week</div>
        </div>
        <div className="text-center p-3 bg-white rounded border">
          <div className="text-2xl font-bold text-blue-600">{mockData.skillMatches}</div>
          <div className="text-sm text-gray-600">Skill Matches</div>
          <div className="text-xs text-green-600">↑ 15% this week</div>
        </div>
        <div className="text-center p-3 bg-white rounded border">
          <div className="text-2xl font-bold text-green-600">{mockData.responseRate}%</div>
          <div className="text-sm text-gray-600">Response Rate</div>
          <div className="text-xs text-gray-500">No change</div>
        </div>
        <div className="text-center p-3 bg-white rounded border">
          <div className="text-2xl font-bold text-yellow-600">{mockData.avgRating}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
          <div className="text-xs text-green-600">↑ 0.2 this month</div>
        </div>
      </div>
    </MockFeature>
  );
};

// Coming Soon Feature
export const ComingSoonFeature = ({ title, description, icon: Icon = Clock }) => {
  return (
    <div className="relative opacity-75">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-20 rounded-lg z-10 flex items-center justify-center">
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-gray-300">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Coming Soon</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-600">{title}</span>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

// Notification Banner for Demo Mode
export const DemoModeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 text-center relative">
      <div className="flex items-center justify-center gap-2">
        <Bell className="w-5 h-5" />
        <span className="font-medium">
          Demo Mode: Some features are simulated for testing purposes
        </span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};
