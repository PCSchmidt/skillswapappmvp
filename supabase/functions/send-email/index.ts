/**
 * Supabase Edge Function - Email Sender
 * 
 * This function handles sending emails using a third-party email delivery service.
 * It supports various email templates for different notification types.
 * 
 * For this implementation, we'll use Resend (https://resend.com/) as our email service
 * but this could be swapped with SendGrid, Mailgun, or another provider as needed.
 */

// Import types
import { EmailTemplateType, EmailTemplateData } from '../../../src/lib/email/templates';

// Define function request body type
interface SendEmailRequest {
  templateType: EmailTemplateType;
  templateData: EmailTemplateData;
}

// Define response type
interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Main handler function
Deno.serve(async (req: Request) => {
  // Parse request body
  const { templateType, templateData } = await req.json() as SendEmailRequest;
  
  try {
    // CORS headers for cross-origin requests
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json',
    };
    
    // Check if request method is OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }
    
    // Validate required fields
    if (!templateType || !templateData) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: templateType and templateData' 
        }),
        { status: 400, headers }
      );
    }
    
    // Get API key from environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service API key not configured' 
        }),
        { status: 500, headers }
      );
    }
    
    // Import the dynamic template based on templateType
    const templateModule = await import(`../../../src/lib/email/templates/${templateType}Template.ts`);
    const templateFunction = templateModule[`${templateType}Template`];
    
    if (!templateFunction) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Template not found for type: ${templateType}` 
        }),
        { status: 400, headers }
      );
    }
    
    // Generate email HTML content from template
    const htmlContent = templateFunction(templateData);
    
    // Get recipient info from template data
    const { recipientName, recipientEmail } = templateData as any;
    
    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Recipient email is required in templateData' 
        }),
        { status: 400, headers }
      );
    }
    
    // Call Resend API to send email
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SkillSwap <notifications@skillswap.example.com>',
        to: recipientEmail,
        subject: getSubjectLine(templateType),
        html: htmlContent,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email');
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.id 
      }),
      { status: 200, headers }
    );
  } catch (error: unknown) {
    // Log the error
    console.error('Error sending email:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Helper function to generate email subject lines based on template type
 */
function getSubjectLine(templateType: EmailTemplateType): string {
  switch (templateType) {
    case 'trade_proposal':
      return 'New Skill Trade Proposal on SkillSwap';
    case 'trade_status_accepted':
      return 'Your Trade Proposal was Accepted!';
    case 'trade_status_declined':
      return 'Trade Proposal Status Update';
    case 'trade_status_cancelled':
      return 'Trade Cancellation Notice';
    case 'trade_status_completed':
      return 'Skill Trade Completed - Leave a Rating!';
    case 'new_message':
      return 'New Message on SkillSwap';
    case 'new_rating':
      return 'You Received a New Rating on SkillSwap';
    case 'welcome':
      return 'Welcome to SkillSwap!';
    case 'password_reset':
      return 'SkillSwap Password Reset';
    default:
      return 'SkillSwap Notification';
  }
}
