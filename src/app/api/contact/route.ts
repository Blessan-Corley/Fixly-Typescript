import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  category: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required fields.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // For now, we'll just log the contact form submission
    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Queue for support team processing
    
    console.log('Contact Form Submission:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      category: body.category,
      message: body.message,
      timestamp: new Date().toISOString()
    })

    // Simulate email sending or database operations
    // In production, you might use services like:
    // - SendGrid, Nodemailer, or Amazon SES for email
    // - MongoDB, PostgreSQL, or Firebase for database
    
    return NextResponse.json(
      { 
        message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.',
        success: true 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form submission error:', error)
    
    return NextResponse.json(
      { message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}