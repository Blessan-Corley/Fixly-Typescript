// Email service for Fixly
// Using Nodemailer with Gmail SMTP (you can switch to SendGrid, AWS SES, etc.)

import nodemailer from 'nodemailer'
import { OTPData } from '@/types'

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
}

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransporter(EMAIL_CONFIG)
  }
  return transporter
}

// Email templates
const emailTemplates = {
  otpVerification: (name: string, otp: string) => ({
    subject: 'Verify your email - Fixly',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px 30px; text-align: center; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
            .content { padding: 40px 30px; }
            .otp-container { background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
            .otp { font-size: 32px; font-weight: bold; color: #6366f1; letter-spacing: 8px; margin: 16px 0; font-family: 'Courier New', monospace; }
            .footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 14px; color: #64748b; }
            .button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Fixly</div>
              <p>Your trusted local services marketplace</p>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Welcome to Fixly! Please verify your email address to complete your registration.</p>
              
              <div class="otp-container">
                <p><strong>Your verification code:</strong></p>
                <div class="otp">${otp}</div>
                <p style="color: #64748b; font-size: 14px;">This code expires in 10 minutes</p>
              </div>
              
              <p>If you didn't create an account with Fixly, you can safely ignore this email.</p>
              <p>Need help? Contact us at <a href="mailto:support@fixly.com" style="color: #6366f1;">support@fixly.com</a></p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Fixly. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${name}!

Welcome to Fixly! Please verify your email address to complete your registration.

Your verification code: ${otp}

This code expires in 10 minutes.

If you didn't create an account with Fixly, you can safely ignore this email.

Need help? Contact us at support@fixly.com

© 2025 Fixly. All rights reserved.
    `
  }),

  welcome: (name: string, role: string) => ({
    subject: `Welcome to Fixly, ${name}! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Fixly</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px 30px; text-align: center; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
            .content { padding: 40px 30px; }
            .feature-list { list-style: none; padding: 0; }
            .feature-list li { padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
            .feature-list li:last-child { border-bottom: none; }
            .button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
            .footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Fixly</div>
              <h1>Welcome aboard! 🚀</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Congratulations! Your Fixly account has been successfully created. You're now ready to ${role === 'fixer' ? 'start earning by offering your skills' : 'get your tasks done by skilled professionals'}.</p>
              
              ${role === 'fixer' ? `
                <h3>As a Fixer, you can:</h3>
                <ul class="feature-list">
                  <li>✅ Browse available jobs in your area</li>
                  <li>✅ Set your own rates and schedule</li>
                  <li>✅ Build your reputation with customer reviews</li>
                  <li>✅ Get paid securely through our platform</li>
                  <li>✅ Access premium tools and resources</li>
                </ul>
              ` : `
                <h3>As a Hirer, you can:</h3>
                <ul class="feature-list">
                  <li>✅ Post jobs and get quotes from skilled fixers</li>
                  <li>✅ Choose from verified professionals in your area</li>
                  <li>✅ Track job progress in real-time</li>
                  <li>✅ Pay securely with multiple payment options</li>
                  <li>✅ Leave reviews to help the community</li>
                </ul>
              `}
              
              <p style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Get Started Now</a>
              </p>
              
              <p>If you have any questions, our support team is here to help at <a href="mailto:support@fixly.com" style="color: #6366f1;">support@fixly.com</a></p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Fixly. All rights reserved.</p>
              <p>Follow us on social media for tips and updates!</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${name}!

Congratulations! Your Fixly account has been successfully created.

${role === 'fixer' ? 'As a Fixer, you can browse jobs, set your rates, and start earning!' : 'As a Hirer, you can post jobs and find skilled professionals!'}

Get started: ${process.env.NEXTAUTH_URL}/dashboard

Need help? Contact us at support@fixly.com

© 2025 Fixly. All rights reserved.
    `
  }),

  passwordReset: (name: string, otp: string) => ({
    subject: 'Reset your password - Fixly',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); color: white; padding: 40px 30px; text-align: center; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
            .content { padding: 40px 30px; }
            .otp-container { background: #fef2f2; border: 2px dashed #fecaca; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
            .otp { font-size: 32px; font-weight: bold; color: #ef4444; letter-spacing: 8px; margin: 16px 0; font-family: 'Courier New', monospace; }
            .footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 14px; color: #64748b; }
            .warning { background: #fef3cd; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Fixly</div>
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>We received a request to reset your password. Use the code below to reset your password:</p>
              
              <div class="otp-container">
                <p><strong>Your reset code:</strong></p>
                <div class="otp">${otp}</div>
                <p style="color: #64748b; font-size: 14px;">This code expires in 15 minutes</p>
              </div>
              
              <div class="warning">
                <p><strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              </div>
              
              <p>For security reasons, this link will expire in 15 minutes.</p>
              <p>Need help? Contact us at <a href="mailto:support@fixly.com" style="color: #6366f1;">support@fixly.com</a></p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Fixly. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${name}!

We received a request to reset your password.

Your reset code: ${otp}

This code expires in 15 minutes.

If you didn't request this password reset, please ignore this email.

Need help? Contact us at support@fixly.com

© 2025 Fixly. All rights reserved.
    `
  })
}

// Send email function
export async function sendEmail({
  to,
  subject,
  template,
  data,
  html,
  text
}: {
  to: string
  subject?: string
  template?: 'otpVerification' | 'welcome' | 'passwordReset'
  data?: any
  html?: string
  text?: string
}) {
  try {
    const transporter = getTransporter()
    
    let emailContent = { subject: subject || 'Fixly Notification', html: '', text: '' }
    
    if (template && data) {
      switch (template) {
        case 'otpVerification':
          emailContent = emailTemplates.otpVerification(data.name, data.otp)
          break
        case 'welcome':
          emailContent = emailTemplates.welcome(data.name, data.role)
          break
        case 'passwordReset':
          emailContent = emailTemplates.passwordReset(data.name, data.otp)
          break
      }
    } else if (html && text) {
      emailContent = { subject: subject || 'Fixly Notification', html, text }
    } else {
      throw new Error('Either template+data or html+text must be provided')
    }

    const mailOptions = {
      from: {
        name: 'Fixly',
        address: process.env.SMTP_FROM || 'noreply@fixly.com'
      },
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      headers: {
        'X-Mailer': 'Fixly Platform',
        'X-Priority': '3'
      }
    }

    const result = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent to ${to}: ${result.messageId}`)
    
    return {
      success: true,
      messageId: result.messageId
    }
    
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    throw new Error(`Failed to send email: ${error}`)
  }
}

// Send OTP email
export async function sendOTPEmail(email: string, name: string, otp: string, type: 'email_verification' | 'password_reset' = 'email_verification') {
  const template = type === 'password_reset' ? 'passwordReset' : 'otpVerification'
  
  return sendEmail({
    to: email,
    template,
    data: { name, otp }
  })
}

// Send welcome email
export async function sendWelcomeEmail(email: string, name: string, role: string) {
  return sendEmail({
    to: email,
    template: 'welcome',
    data: { name, role }
  })
}

// Verify email service configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const transporter = getTransporter()
    await transporter.verify()
    console.log('✅ Email service configured correctly')
    return true
  } catch (error) {
    console.error('❌ Email service configuration error:', error)
    return false
  }
}

// Queue system for bulk emails (basic implementation)
class EmailQueue {
  private queue: Array<{ to: string; subject: string; template?: string; data?: any; html?: string; text?: string }> = []
  private processing = false

  add(emailData: { to: string; subject: string; template?: string; data?: any; html?: string; text?: string }) {
    this.queue.push(emailData)
    if (!this.processing) {
      this.process()
    }
  }

  private async process() {
    this.processing = true
    
    while (this.queue.length > 0) {
      const emailData = this.queue.shift()
      if (!emailData) break
      
      try {
        await sendEmail(emailData)
        // Small delay to avoid overwhelming SMTP server
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error('Queued email failed:', error)
        // Could implement retry logic here
      }
    }
    
    this.processing = false
  }
}

export const emailQueue = new EmailQueue()

// Email analytics (basic tracking)
export async function trackEmailOpen(messageId: string, userId: string) {
  // Implementation would depend on your analytics system
  console.log(`Email opened - MessageID: ${messageId}, UserID: ${userId}`)
}

export async function trackEmailClick(messageId: string, userId: string, linkUrl: string) {
  // Implementation would depend on your analytics system
  console.log(`Email link clicked - MessageID: ${messageId}, UserID: ${userId}, URL: ${linkUrl}`)
}