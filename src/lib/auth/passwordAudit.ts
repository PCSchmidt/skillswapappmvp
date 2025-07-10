/**
 * Password Strength Audit System
 * 
 * Provides comprehensive password strength validation and weak password detection
 * for existing user accounts to enforce security standards.
 */

// Common weak passwords that should trigger forced reset
const COMMON_WEAK_PASSWORDS = [
  'password', 'password123', '123456', '12345678', 'qwerty', 'abc123',
  'password1', 'admin', 'letmein', 'welcome', 'monkey', 'dragon',
  'password12', 'iloveyou', 'sunshine', 'princess', 'football',
  'charlie', 'aa123456', 'donald', 'baseball', 'welcome123'
];

// Patterns that indicate weak passwords
const WEAK_PATTERNS = [
  /^(.)\1+$/, // All same character (e.g., 'aaaaaaa')
  /^(012|123|234|345|456|567|678|789|890)+/, // Sequential numbers
  /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+/i, // Sequential letters
  /^(qwerty|asdfgh|zxcvbn)+/i, // Keyboard patterns
  /^(password|admin|user|guest|login|root|test)+/i, // Common base words
];

export interface PasswordAuditResult {
  isWeak: boolean;
  weaknessReasons: string[];
  strengthScore: number; // 0-100 scale
  requiresReset: boolean;
  suggestions: string[];
}

export interface PasswordStrengthCriteria {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  noCommonPatterns: boolean;
  noPersonalInfo: boolean;
}

/**
 * Comprehensive password strength audit
 */
export function auditPasswordStrength(
  password: string, 
  userEmail?: string, 
  userName?: string
): PasswordAuditResult {
  const reasons: string[] = [];
  const suggestions: string[] = [];
  let strengthScore = 0;
  
  // Check basic criteria
  const criteria = evaluatePasswordCriteria(password, userEmail, userName);
  
  // Length check (minimum 12 characters)
  if (password.length < 12) {
    reasons.push('Password is too short (minimum 12 characters required)');
    suggestions.push('Use at least 12 characters');
  } else if (password.length >= 12) {
    strengthScore += 20;
  }
  
  // Character diversity checks
  if (!criteria.hasUppercase) {
    reasons.push('Missing uppercase letters');
    suggestions.push('Include uppercase letters (A-Z)');
  } else {
    strengthScore += 15;
  }
  
  if (!criteria.hasLowercase) {
    reasons.push('Missing lowercase letters');
    suggestions.push('Include lowercase letters (a-z)');
  } else {
    strengthScore += 15;
  }
  
  if (!criteria.hasNumbers) {
    reasons.push('Missing numbers');
    suggestions.push('Include numbers (0-9)');
  } else {
    strengthScore += 15;
  }
  
  if (!criteria.hasSpecialChars) {
    reasons.push('Missing special characters');
    suggestions.push('Include special characters (@$!%*?&)');
  } else {
    strengthScore += 15;
  }
  
  // Common weak password check
  if (COMMON_WEAK_PASSWORDS.includes(password.toLowerCase())) {
    reasons.push('This is a commonly used weak password');
    suggestions.push('Choose a unique password that is not commonly used');
    strengthScore = Math.min(strengthScore, 20); // Cap at very low score
  }
  
  // Pattern checks
  for (const pattern of WEAK_PATTERNS) {
    if (pattern.test(password)) {
      reasons.push('Password contains predictable patterns');
      suggestions.push('Avoid sequential characters and keyboard patterns');
      strengthScore = Math.min(strengthScore, 40); // Cap at low score
      break;
    }
  }
  
  // Personal information check
  if (userEmail && password.toLowerCase().includes(userEmail.split('@')[0].toLowerCase())) {
    reasons.push('Password contains parts of your email');
    suggestions.push('Avoid using your email or name in your password');
    strengthScore = Math.min(strengthScore, 30);
  }
  
  if (userName && password.toLowerCase().includes(userName.toLowerCase())) {
    reasons.push('Password contains parts of your name');
    suggestions.push('Avoid using your name in your password');
    strengthScore = Math.min(strengthScore, 30);
  }
  
  // Repeated characters check
  if (/(.)\1{2,}/.test(password)) {
    reasons.push('Password contains repeated characters');
    suggestions.push('Avoid repeating the same character multiple times');
    strengthScore = Math.min(strengthScore, 50);
  }
  
  // Bonus points for length
  if (password.length >= 16) {
    strengthScore += 10;
  }
  if (password.length >= 20) {
    strengthScore += 10;
  }
  
  // Determine if password is weak and requires reset
  const isWeak = reasons.length > 0 || strengthScore < 60;
  const requiresReset = isWeak || COMMON_WEAK_PASSWORDS.includes(password.toLowerCase());
  
  return {
    isWeak,
    weaknessReasons: reasons,
    strengthScore: Math.min(strengthScore, 100),
    requiresReset,
    suggestions
  };
}

/**
 * Evaluate password against specific criteria
 */
export function evaluatePasswordCriteria(
  password: string, 
  userEmail?: string, 
  userName?: string
): PasswordStrengthCriteria {
  return {
    hasMinLength: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[@$!%*?&]/.test(password),
    noCommonPatterns: !WEAK_PATTERNS.some(pattern => pattern.test(password)),
    noPersonalInfo: !containsPersonalInfo(password, userEmail, userName)
  };
}

/**
 * Check if password contains personal information
 */
function containsPersonalInfo(password: string, userEmail?: string, userName?: string): boolean {
  const lowerPassword = password.toLowerCase();
  
  if (userEmail) {
    const emailParts = userEmail.toLowerCase().split('@')[0];
    if (lowerPassword.includes(emailParts)) {
      return true;
    }
  }
  
  if (userName) {
    const nameParts = userName.toLowerCase().split(' ');
    for (const part of nameParts) {
      if (part.length > 2 && lowerPassword.includes(part)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Generate password strength description
 */
export function getPasswordStrengthDescription(score: number): {
  level: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  color: string;
  description: string;
} {
  if (score < 20) {
    return {
      level: 'Very Weak',
      color: 'red',
      description: 'This password is very weak and easily guessable'
    };
  } else if (score < 40) {
    return {
      level: 'Weak',
      color: 'red',
      description: 'This password is weak and should be improved'
    };
  } else if (score < 60) {
    return {
      level: 'Fair',
      color: 'yellow',
      description: 'This password is fair but could be stronger'
    };
  } else if (score < 80) {
    return {
      level: 'Good',
      color: 'blue',
      description: 'This password is good and reasonably secure'
    };
  } else if (score < 95) {
    return {
      level: 'Strong',
      color: 'green',
      description: 'This password is strong and secure'
    };
  } else {
    return {
      level: 'Very Strong',
      color: 'green',
      description: 'This password is very strong and highly secure'
    };
  }
}

/**
 * Quick check for common weak passwords (for existing account audits)
 */
export function isCommonWeakPassword(password: string): boolean {
  return COMMON_WEAK_PASSWORDS.includes(password.toLowerCase());
}

/**
 * Enhanced password validation for forms
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
} {
  const audit = auditPasswordStrength(password);
  
  return {
    isValid: !audit.isWeak,
    errors: audit.weaknessReasons,
    suggestions: audit.suggestions
  };
}
