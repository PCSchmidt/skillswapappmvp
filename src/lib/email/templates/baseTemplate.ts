/**
 * Base Email Template
 * 
 * This template serves as the foundation for all email templates.
 * It includes the common HTML structure, header, footer, and styling.
 */

export const baseTemplate = (content: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SkillSwap Notification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .email-header {
      background-color: #7c3aed;
      padding: 24px;
      text-align: center;
    }
    .email-header img {
      max-width: 150px;
      height: auto;
    }
    .email-body {
      padding: 32px 24px;
    }
    .email-footer {
      background-color: #f3f4f6;
      padding: 16px 24px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background-color: #7c3aed;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: 600;
      margin-top: 16px;
    }
    .btn:hover {
      background-color: #6d28d9;
    }
    .skill-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
      background-color: #f9fafb;
    }
    .rating {
      color: #f59e0b;
      font-size: 24px;
    }
    .text-center {
      text-align: center;
    }
    .divider {
      border-top: 1px solid #e5e7eb;
      margin: 24px 0;
    }
    .text-secondary {
      color: #6b7280;
    }
    .text-primary {
      color: #7c3aed;
    }
    @media only screen and (max-width: 600px) {
      .email-body {
        padding: 24px 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="https://skillswap.example.com/logo-white.png" alt="SkillSwap Logo" />
    </div>
    <div class="email-body">
      ${content}
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} SkillSwap. All rights reserved.</p>
      <p>
        <a href="https://skillswap.example.com/email-preferences" style="color: #7c3aed;">Email Preferences</a> |
        <a href="https://skillswap.example.com/privacy" style="color: #7c3aed;">Privacy Policy</a> |
        <a href="https://skillswap.example.com/terms" style="color: #7c3aed;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};
