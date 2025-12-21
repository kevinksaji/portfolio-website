'use server';

import { sendContactEmail } from '@/lib/email';

/**
 * Server action for contact form submission
 * Processes form data and sends email via API endpoint
 */

/**
 * Submits contact form data to email API
 * @param prevState - Previous form state (required by useFormState)
 * @param formData - FormData containing email, subject, and message fields
 * @returns Promise resolving to success status and optional error message
 */
export async function submitContactForm(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract form fields from FormData
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Validate required fields
    if (!email || !subject || !message) {
      return { success: false, error: 'All fields are required' };
    }

    // Validate email format
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    await sendContactEmail({
      fromEmail: email,
      subject,
      message,
    });

    return { success: true };
  } catch (error) {
    console.error('Contact form error:', error);
    return { success: false, error: 'Failed to send message. Please try again.' };
  }
}
