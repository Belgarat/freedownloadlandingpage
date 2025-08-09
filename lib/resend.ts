import { Resend } from 'resend'
import { getEbookEmailTemplate, getFollowUpEmailTemplate, EmailTemplateData } from './email-templates'
import { BOOK_CONFIG, EMAIL_CONFIG } from './book-config'
import configLoader from './config-loader'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  email: string
  name?: string
  downloadUrl?: string
}

export const sendEbookEmail = async (data: EmailData) => {
  try {
    // Get config
    const config = await configLoader.loadConfig()
    const emailConfig = config.email

    // Replace placeholders in template
    const htmlContent = emailConfig.templates.download.html
      .replace(/{{downloadUrl}}/g, data.downloadUrl || BOOK_CONFIG.amazonUrl)
      .replace(/{{name}}/g, data.name || 'there')
      .replace(/{{bookTitle}}/g, BOOK_CONFIG.title)
      .replace(/{{authorName}}/g, BOOK_CONFIG.author)
      .replace(/{{goodreadsUrl}}/g, BOOK_CONFIG.goodreadsUrl || 'https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns')
      .replace(/{{amazonUrl}}/g, BOOK_CONFIG.amazonUrl)
      .replace(/{{substackUrl}}/g, BOOK_CONFIG.substackUrl || 'https://aroundscifi.substack.com/')
      .replace(/{{substackName}}/g, BOOK_CONFIG.substackName || 'Around Sci-Fi')
      .replace(/{{publisherUrl}}/g, BOOK_CONFIG.publisherUrl)
      .replace(/{{publisherName}}/g, BOOK_CONFIG.publisher)

    const textContent = emailConfig.templates.download.text
      .replace(/{{downloadUrl}}/g, data.downloadUrl || BOOK_CONFIG.amazonUrl)
      .replace(/{{name}}/g, data.name || 'there')
      .replace(/{{bookTitle}}/g, BOOK_CONFIG.title)
      .replace(/{{authorName}}/g, BOOK_CONFIG.author)
      .replace(/{{goodreadsUrl}}/g, BOOK_CONFIG.goodreadsUrl || 'https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns')
      .replace(/{{amazonUrl}}/g, BOOK_CONFIG.amazonUrl)
      .replace(/{{substackUrl}}/g, BOOK_CONFIG.substackUrl || 'https://aroundscifi.substack.com/')
      .replace(/{{substackName}}/g, BOOK_CONFIG.substackName || 'Around Sci-Fi')
      .replace(/{{publisherUrl}}/g, BOOK_CONFIG.publisherUrl)
      .replace(/{{publisherName}}/g, BOOK_CONFIG.publisher)

    const { data: emailData, error } = await resend.emails.send({
      from: `${emailConfig.sender.name} <${emailConfig.sender.email}>`,
      to: [data.email],
      subject: emailConfig.templates.download.subject,
      html: htmlContent,
      text: textContent
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

export const sendFollowUpEmail = async (data: EmailData) => {
  try {
    // Get config
    const config = await configLoader.loadConfig()
    const emailConfig = config.email

    // Replace placeholders in template
    const htmlContent = emailConfig.templates.followup.html
      .replace(/{{downloadUrl}}/g, data.downloadUrl || BOOK_CONFIG.amazonUrl)
      .replace(/{{name}}/g, data.name || 'there')
      .replace(/{{bookTitle}}/g, BOOK_CONFIG.title)
      .replace(/{{authorName}}/g, BOOK_CONFIG.author)
      .replace(/{{goodreadsUrl}}/g, BOOK_CONFIG.goodreadsUrl || 'https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns')
      .replace(/{{amazonUrl}}/g, BOOK_CONFIG.amazonUrl)
      .replace(/{{substackUrl}}/g, BOOK_CONFIG.substackUrl || 'https://aroundscifi.substack.com/')
      .replace(/{{substackName}}/g, BOOK_CONFIG.substackName || 'Around Sci-Fi')
      .replace(/{{publisherUrl}}/g, BOOK_CONFIG.publisherUrl)
      .replace(/{{publisherName}}/g, BOOK_CONFIG.publisher)

    const textContent = emailConfig.templates.followup.text
      .replace(/{{downloadUrl}}/g, data.downloadUrl || BOOK_CONFIG.amazonUrl)
      .replace(/{{name}}/g, data.name || 'there')
      .replace(/{{bookTitle}}/g, BOOK_CONFIG.title)
      .replace(/{{authorName}}/g, BOOK_CONFIG.author)
      .replace(/{{goodreadsUrl}}/g, BOOK_CONFIG.goodreadsUrl || 'https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns')
      .replace(/{{amazonUrl}}/g, BOOK_CONFIG.amazonUrl)
      .replace(/{{substackUrl}}/g, BOOK_CONFIG.substackUrl || 'https://aroundscifi.substack.com/')
      .replace(/{{substackName}}/g, BOOK_CONFIG.substackName || 'Around Sci-Fi')
      .replace(/{{publisherUrl}}/g, BOOK_CONFIG.publisherUrl)
      .replace(/{{publisherName}}/g, BOOK_CONFIG.publisher)

    const { data: emailData, error } = await resend.emails.send({
      from: `${emailConfig.sender.name} <${emailConfig.sender.email}>`,
      to: [data.email],
      subject: emailConfig.templates.followup.subject,
      html: htmlContent,
      text: textContent
    })

    if (error) {
      console.error('Resend follow-up error:', error)
      throw new Error('Failed to send follow-up email')
    }

    return {
      success: true,
      messageId: emailData?.id,
      message: 'Follow-up email sent successfully'
    }
  } catch (error) {
    console.error('Resend follow-up error:', error)
    throw new Error('Failed to send follow-up email')
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