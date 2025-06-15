'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  previewImageUrl: string;
}

interface EmailTemplatePreviewProps {
  onSelect?: (templateId: string) => void;
  className?: string;
  preselectedTemplateId?: string;
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Sent to users when they first sign up for SkillSwap',
    subject: 'Welcome to SkillSwap! Let\'s get started.',
    previewImageUrl: '/images/email-templates/welcome-preview.png',
  },
  {
    id: 'match_notification',
    name: 'New Match Notification',
    description: 'Sent when a potential skill match is found',
    subject: 'We found a potential skill match for you!',
    previewImageUrl: '/images/email-templates/match-preview.png',
  },
  {
    id: 'message_notification',
    name: 'New Message Notification',
    description: 'Sent when you receive a new message',
    subject: 'You have a new message on SkillSwap',
    previewImageUrl: '/images/email-templates/message-preview.png',
  },
  {
    id: 'trade_request',
    name: 'New Trade Request',
    description: 'Sent when someone requests to trade skills with you',
    subject: 'New Skill Trade Request on SkillSwap',
    previewImageUrl: '/images/email-templates/trade-request-preview.png',
  },
  {
    id: 'trade_status_update',
    name: 'Trade Status Update',
    description: 'Sent when the status of a trade changes',
    subject: 'Update on your SkillSwap trade',
    previewImageUrl: '/images/email-templates/trade-update-preview.png',
  },
  {
    id: 'review_notification',
    name: 'New Review Notification',
    description: 'Sent when you receive a new review',
    subject: 'You received a new review on SkillSwap',
    previewImageUrl: '/images/email-templates/review-preview.png',
  },
  {
    id: 'weekly_digest',
    name: 'Weekly Digest',
    description: 'Weekly summary of your activity on SkillSwap',
    subject: 'Your SkillSwap Weekly Digest',
    previewImageUrl: '/images/email-templates/weekly-digest-preview.png',
  },
];

export function EmailTemplatePreview({ 
  onSelect, 
  className = '', 
  preselectedTemplateId 
}: EmailTemplatePreviewProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    preselectedTemplateId || EMAIL_TEMPLATES[0].id
  );
  const [enlargedView, setEnlargedView] = useState<boolean>(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (onSelect) {
      onSelect(templateId);
    }
  };

  const selectedTemplate = EMAIL_TEMPLATES.find(
    (template) => template.id === selectedTemplateId
  );

  const toggleEnlargedView = () => {
    setEnlargedView(!enlargedView);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Email Template Preview</h2>
        <p className="text-gray-600">
          Preview how email notifications will appear to recipients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-medium mb-4">Template Gallery</h3>
          <div className="space-y-2 overflow-y-auto max-h-[500px] pr-2">
            {EMAIL_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedTemplateId === template.id
                    ? 'bg-primary-50 border-l-4 border-primary'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedTemplate && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{selectedTemplate.name}</h3>
                <button
                  type="button"
                  onClick={toggleEnlargedView}
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  {enlargedView ? 'Exit Full Preview' : 'View Full Size'}
                </button>
              </div>

              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <div className="text-sm font-medium text-gray-900">Subject:</div>
                <div className="text-gray-700">{selectedTemplate.subject}</div>
              </div>

              <div
                className={`relative bg-white border border-gray-200 rounded-md overflow-hidden ${
                  enlargedView ? 'fixed inset-0 z-50 p-4 bg-black bg-opacity-80 flex items-center justify-center' : ''
                }`}
              >
                {enlargedView && (
                  <div 
                    className="absolute top-4 right-4 bg-white rounded-full p-2 cursor-pointer z-10"
                    onClick={toggleEnlargedView}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                
                <div className={`${enlargedView ? 'w-auto max-w-4xl max-h-[90vh]' : 'w-full'}`}>
                  {/* Placeholder for the email template preview image */}
                  <div className="aspect-[4/5] bg-gray-200 flex items-center justify-center">
                    {selectedTemplate.previewImageUrl ? (
                      <img
                        src={selectedTemplate.previewImageUrl}
                        alt={`${selectedTemplate.name} preview`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="mt-2 text-sm">Template preview not available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p>
                  <strong>Note:</strong> Actual emails will be personalized with the recipient's
                  information and relevant details about the notification.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
