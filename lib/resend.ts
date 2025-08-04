import { Resend } from 'resend'
import { getEbookEmailTemplate, EmailTemplateData } from './email-templates'
import { BOOK_CONFIG, EMAIL_CONFIG } from './book-config'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  email: string
  name?: string
  downloadUrl?: string
}

export const sendEbookEmail = async (data: EmailData) => {
  try {
    // Prepare template data
    const templateData: EmailTemplateData = {
      name: data.name,
      downloadUrl: data.downloadUrl || BOOK_CONFIG.amazonUrl,
      bookTitle: BOOK_CONFIG.title,
      authorName: BOOK_CONFIG.author,
      amazonUrl: BOOK_CONFIG.amazonUrl,
      publisherName: BOOK_CONFIG.publisher,
      publisherUrl: BOOK_CONFIG.publisherUrl
    }

    // Get email template
    const template = getEbookEmailTemplate(templateData)

    const { data: emailData, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.senderName} <${EMAIL_CONFIG.senderEmail}>`,
      to: [data.email],
      subject: template.subject,
      html: template.html,
      text: template.text
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error('Failed to send email')
    }

    return {
      success: true,
      messageId: emailData?.id,
      message: 'Email sent successfully'
    }
  } catch (error) {
    console.error('Resend error:', error)
    throw new Error('Failed to send email')
  }
}

export const verifyEmail = async (email: string) => {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format')
  }

  // Check for disposable email domains (basic check)
  const disposableDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
    'mailinator.com', 'throwaway.email', 'temp-mail.org',
    'yopmail.com', 'getnada.com', 'tempmailaddress.com',
    'mailnesia.com', 'sharklasers.com', 'guerrillamailblock.com'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (disposableDomains.includes(domain)) {
    throw new Error('Disposable email addresses are not allowed')
  }

  return true
} 