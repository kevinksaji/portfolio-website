import nodemailer from 'nodemailer';

export async function sendContactEmail(params: {
    fromEmail: string;
    subject: string;
    message: string;
}): Promise<void> {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        throw new Error('Missing EMAIL_USER or EMAIL_PASS');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    await transporter.sendMail({
        from: emailUser,
        to: emailUser,
        replyTo: params.fromEmail,
        subject: params.subject,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="margin-bottom: 20px;">${params.message.replace(/\n/g, '<br>')}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">This email was sent from your portfolio website contact form.</p>
        </div>
      `,
        text: `
${params.message}

---
This email was sent from kev.ai
      `,
    });
}
