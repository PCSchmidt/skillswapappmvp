/**
 * Notification Expiration Service
 * 
 * Handles the automatic expiration of notifications based on their type and priority.
 * This service provides utilities to calculate expiration times and check if notifications
 * should be expired.
 */

import { parseISO, addDays, addHours } from 'date-fns';

// Custom implementation of differenceInDays to avoid Date.UTC issues in tests
export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const timezoneOffset = (dateRight.getTimezoneOffset() - dateLeft.getTimezoneOffset()) * 60 * 1000;
  const differenceInMs = dateLeft.getTime() - dateRight.getTime() - timezoneOffset;
  return Math.round(differenceInMs / millisecondsPerDay);
}

// Notification types and their default expiration periods (in days)
const DEFAULT_EXPIRATION_PERIODS = {
  // System notifications
  'system': 30,
  'announcement': 14,
  'maintenance': 7,
  
  // User interaction notifications
  'message': 60,
  'mention': 30,
  'comment': 30,
  'reaction': 14,
  
  // Trade/Skill related notifications
  'trade_request': 14,
  'trade_update': 30,
  'trade_completed': 60,
  'skill_match': 7,
  
  // Review related notifications
  'new_review': 30,
  'review_reminder': 3,
  
  // Default for unknown types
  'default': 30
};

// Priority-based multipliers for expiration periods
const PRIORITY_MULTIPLIERS = {
  'urgent': 0.5,    // Expires twice as fast
  'high': 0.75,     // Expires 25% faster
  'normal': 1,      // Standard expiration
  'low': 1.5        // Expires 50% slower
};

/**
 * Calculate expiration date for a notification
 * 
 * @param type - Notification type
 * @param priority - Notification priority
 * @param createdAt - Creation date of notification
 * @returns Expiration date as ISO string
 */
export function calculateExpirationDate(
  type: string, 
  priority: 'urgent' | 'high' | 'normal' | 'low',
  createdAt: string
): string {
  // Get base expiration period (days)
  const basePeriod = DEFAULT_EXPIRATION_PERIODS[type] || DEFAULT_EXPIRATION_PERIODS.default;
  
  // Apply priority multiplier
  const adjustedPeriod = basePeriod * (PRIORITY_MULTIPLIERS[priority] || 1);
  
  // Calculate expiration date
  const creationDate = parseISO(createdAt);
  const expirationDate = addDays(creationDate, adjustedPeriod);
  
  return expirationDate.toISOString();
}

/**
 * Check if a notification should be expired
 * 
 * @param createdAt - Creation date of notification
 * @param type - Notification type
 * @param priority - Notification priority
 * @returns boolean indicating if notification should be expired
 */
export function shouldExpireNotification(
  createdAt: string,
  type: string,
  priority: 'urgent' | 'high' | 'normal' | 'low'
): boolean {
  const now = new Date();
  const creationDate = parseISO(createdAt);
  
  // Get base expiration period (days)
  const basePeriod = DEFAULT_EXPIRATION_PERIODS[type] || DEFAULT_EXPIRATION_PERIODS.default;
  
  // Apply priority multiplier
  const adjustedPeriod = basePeriod * (PRIORITY_MULTIPLIERS[priority] || 1);
  
  // Check if days since creation exceeds adjusted period
  // Use our custom implementation
  const daysSinceCreation = differenceInDays(now, creationDate);
  
  return daysSinceCreation >= adjustedPeriod;
}

/**
 * Get days until a notification expires
 * 
 * @param createdAt - Creation date of notification
 * @param type - Notification type
 * @param priority - Notification priority
 * @returns Days until expiration (negative if already expired)
 */
export function getDaysUntilExpiration(
  createdAt: string,
  type: string,
  priority: 'urgent' | 'high' | 'normal' | 'low'
): number {
  const now = new Date();
  const creationDate = parseISO(createdAt);
  
  // Get base expiration period (days)
  const basePeriod = DEFAULT_EXPIRATION_PERIODS[type] || DEFAULT_EXPIRATION_PERIODS.default;
  
  // Apply priority multiplier
  const adjustedPeriod = basePeriod * (PRIORITY_MULTIPLIERS[priority] || 1);
  
  // Calculate expiration date
  const expirationDate = addDays(creationDate, adjustedPeriod);
  
  // Calculate days until expiration
  // Use our custom implementation
  const daysUntilExpiration = differenceInDays(expirationDate, now);
  
  return daysUntilExpiration;
}

/**
 * Batch process notifications to identify expired ones
 * 
 * @param notifications - Array of notification objects
 * @returns Array of IDs of expired notifications
 */
// Define the notification type
interface Notification {
  id: string;
  created_at: string;
  type: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
}

export function findExpiredNotifications(notifications: Notification[]): string[] {
  return notifications
    .filter(notification => 
      shouldExpireNotification(
        notification.created_at,
        notification.type,
        notification.priority
      )
    )
    .map(notification => notification.id);
}

/**
 * Calculate expiration time for short-lived notifications (in hours)
 * 
 * @param type - Notification type
 * @param priority - Notification priority
 * @returns Expiration time in hours
 */
export function getShortTermExpirationHours(
  type: string,
  priority: 'urgent' | 'high' | 'normal' | 'low'
): number {
  // Short expiration mapping (hours)
  const shortExpirations = {
    'alert': 2,
    'status_update': 4,
    'reminder': 12,
    'default': 24
  };
  
  // Get base hours
  const baseHours = shortExpirations[type] || shortExpirations.default;
  
  // Apply priority adjustment
  return baseHours * (PRIORITY_MULTIPLIERS[priority] || 1);
}

/**
 * Create automatic expiration time for a notification
 * 
 * @param type - Notification type
 * @param priority - Notification priority
 * @param createdAt - Creation date
 * @returns Timestamp when notification should expire
 */
export function createExpirationTimestamp(
  type: string,
  priority: 'urgent' | 'high' | 'normal' | 'low',
  createdAt: string
): number {
  const isShortTerm = ['alert', 'status_update', 'reminder'].includes(type);
  
  if (isShortTerm) {
    const hours = getShortTermExpirationHours(type, priority);
    return addHours(parseISO(createdAt), hours).getTime();
  } else {
    return parseISO(calculateExpirationDate(type, priority, createdAt)).getTime();
  }
}

const expirationService = {
  calculateExpirationDate,
  shouldExpireNotification,
  getDaysUntilExpiration,
  findExpiredNotifications,
  getShortTermExpirationHours,
  createExpirationTimestamp
};

export default expirationService;
