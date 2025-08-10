import { Resend } from 'resend'
import { getEbookEmailTemplate, getFollowUpEmailTemplate, EmailTemplateData } from './email-templates'
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
    const bookConfig = config.book

    // Helper function to replace placeholders
    const replacePlaceholders = (content: string) => {
      return content
        .replace(/{{downloadUrl}}/g, data.downloadUrl || bookConfig.amazonUrl)
        .replace(/{{name}}/g, data.name || 'there')
        .replace(/{{bookTitle}}/g, bookConfig.title)
        .replace(/{{authorName}}/g, bookConfig.author)
        .replace(/{{goodreadsUrl}}/g, bookConfig.goodreadsUrl || '')
        .replace(/{{amazonUrl}}/g, bookConfig.amazonUrl)
        .replace(/{{substackUrl}}/g, bookConfig.substackUrl || '')
        .replace(/{{substackName}}/g, bookConfig.substackName || '')
        .replace(/{{publisherUrl}}/g, bookConfig.publisherUrl)
        .replace(/{{publisherName}}/g, bookConfig.publisher)
    }

    // Replace placeholders in all content
    const htmlContent = replacePlaceholders(emailConfig.templates.download.html)
    const textContent = replacePlaceholders(emailConfig.templates.download.text)
    const subject = replacePlaceholders(emailConfig.templates.download.subject)

    const { data: emailData, error } = await resend.emails.send({
      from: `${emailConfig.sender.name} <${emailConfig.sender.email}>`,
      to: [data.email],
      subject: subject,
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
    const bookConfig = config.book

    // Helper function to replace placeholders
    const replacePlaceholders = (content: string) => {
      return content
        .replace(/{{downloadUrl}}/g, data.downloadUrl || bookConfig.amazonUrl)
        .replace(/{{name}}/g, data.name || 'there')
        .replace(/{{bookTitle}}/g, bookConfig.title)
        .replace(/{{authorName}}/g, bookConfig.author)
        .replace(/{{goodreadsUrl}}/g, bookConfig.goodreadsUrl || '')
        .replace(/{{amazonUrl}}/g, bookConfig.amazonUrl)
        .replace(/{{substackUrl}}/g, bookConfig.substackUrl || '')
        .replace(/{{substackName}}/g, bookConfig.substackName || '')
        .replace(/{{publisherUrl}}/g, bookConfig.publisherUrl)
        .replace(/{{publisherName}}/g, bookConfig.publisher)
    }

    // Replace placeholders in all content
    const htmlContent = replacePlaceholders(emailConfig.templates.followup.html)
    const textContent = replacePlaceholders(emailConfig.templates.followup.text)
    const subject = replacePlaceholders(emailConfig.templates.followup.subject)

    const { data: emailData, error } = await resend.emails.send({
      from: `${emailConfig.sender.name} <${emailConfig.sender.email}>`,
      to: [data.email],
      subject: subject,
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