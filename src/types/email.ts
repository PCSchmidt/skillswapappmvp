// Shared types for email and notification services

export type EmailTemplateType = 
  | 'trade_proposal'
  | 'trade_status_accepted'
  | 'trade_status_declined'
  | 'trade_status_cancelled'
  | 'trade_status_completed'
  | 'new_message'
  | 'new_rating'
  | 'welcome'
  | 'password_reset'
  | 'verification';

export interface BaseTemplateData {
  recipientName: string;
  recipientEmail: string;
}

export interface TradeTemplateData extends BaseTemplateData {
  traderId: string;
  traderName: string;
  skillName: string;
  tradeId: string;
  tradeDate?: string;
}

export interface MessageTemplateData extends BaseTemplateData {
  senderId: string;
  senderName: string;
  tradeId: string;
  messagePreview: string;
}

export interface RatingTemplateData extends BaseTemplateData {
  raterId: string;
  raterName: string;
  tradeId: string;
  rating: number;
  skillName: string;
}

export interface WelcomeTemplateData extends BaseTemplateData {
  verificationLink?: string;
}

export interface PasswordResetTemplateData extends BaseTemplateData {
  resetLink: string;
}

export type EmailTemplateData =
  | TradeTemplateData
  | MessageTemplateData
  | RatingTemplateData
  | WelcomeTemplateData
  | PasswordResetTemplateData;
