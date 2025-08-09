export interface EmailTemplateData {
  name?: string
  downloadUrl: string
  bookTitle: string
  authorName: string
  publisherName: string
  publisherUrl: string
}

export const getEbookEmailTemplate = (data: EmailTemplateData) => {
  const {
    name = 'there',
    downloadUrl,
    bookTitle = 'Fish Cannot Carry Guns',
    authorName = 'Michael B. Morgan',
    publisherName = '3/7 Indie Lab',
    publisherUrl = 'https://37indielab.com'
  } = data

  return {
    subject: `Your Free Ebook: ${bookTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Free Ebook</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0f766e, #0891b2, #1e40af); padding: 30px; border-radius: 10px; color: white;">
          <h1 style="margin: 0 0 20px 0; font-size: 24px;">${bookTitle}</h1>
          <p style="margin: 0; font-size: 16px;">Your free ebook is ready!</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #0f766e; margin-top: 0;">Thank you for your interest!</h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for downloading your free copy of <strong>${bookTitle}</strong> by ${authorName}.</p>
          
          <p>This collection of speculative short stories delves into how technology fractures identity, erodes trust, and distorts reality. For fans of Black Mirror, cyberpunk noir, and fringe futurism.</p>
          
          <div style="background: #e8f5e8; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #065f46;">What's included in your free copy:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>Betrayal Circuit:</strong> Captain Stalworth believes he can trust Private Jude Veil. He is wrong.</li>
              <li><strong>Devil's Advocate:</strong> What if you were trapped in a cell... with the person who killed you?</li>
              <li><strong>Fish Cannot Carry Guns:</strong> All his life, John had thought he was safe...</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Download Your Free Copy (PDF)
            </a>
            <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">
              ⏰ This link expires in 3 days
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #0c4a6e;">Support Independent Authors</h3>
            <p style="margin: 0 0 15px 0; color: #0c4a6e;">
              Since this book is completely free, we'd be grateful if you could support ${authorName} in these ways:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
              <li><strong>Add to Goodreads:</strong> Mark "${bookTitle}" as "Want to Read" on Goodreads to help other readers discover it</li>
              <li><strong>Subscribe to Substack:</strong> Follow <a href="https://aroundscifi.substack.com/" style="color: #0ea5e9;">Around Sci-Fi</a> for the latest in speculative fiction and author interviews</li>
            </ul>
            <div style="text-align: center; margin-top: 15px;">
              <a href="https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns" 
                 style="background: #0ea5e9; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px; margin-right: 10px;">
                Add to Goodreads
              </a>
              <a href="https://aroundscifi.substack.com/" 
                 style="background: #f59e0b; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">
                Subscribe to Substack
              </a>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="font-size: 14px; color: #6b7280;">
            <p><strong>About the Author:</strong></p>
            <p>${authorName} is a lifelong reader with a love for physics, psychology, and stories that ask hard questions, and don't always offer easy answers. Consultant by day, author by night.</p>
            
            <p><strong>Publisher:</strong> <a href="${publisherUrl}" style="color: #0f766e;">${publisherName}</a> - Be independent, be unique.</p>
            
            <p style="margin-top: 30px; font-size: 12px; color: #9ca3af;">
              You received this email because you requested a free copy of "${bookTitle}". 
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
${bookTitle} - Your Free Ebook

Thank you for your interest in "${bookTitle}" by ${authorName}!

This collection of speculative short stories delves into how technology fractures identity, erodes trust, and distorts reality. For fans of Black Mirror, cyberpunk noir, and fringe futurism.

What's included in your free copy:
- Betrayal Circuit: Captain Stalworth believes he can trust Private Jude Veil. He is wrong.
- Devil's Advocate: What if you were trapped in a cell... with the person who killed you?
- Fish Cannot Carry Guns: All his life, John had thought he was safe...

Download your free copy: ${downloadUrl}
⚠️ This link expires in 3 days

Support Independent Authors:
Since this book is completely free, we'd be grateful if you could support ${authorName} by:
- Adding "${bookTitle}" to your Goodreads "Want to Read" list: https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns
- Subscribing to Around Sci-Fi on Substack: https://aroundscifi.substack.com/

About the Author:
${authorName} is a lifelong reader with a love for physics, psychology, and stories that ask hard questions, and don't always offer easy answers. Consultant by day, author by night.

Publisher: ${publisherName} - Be independent, be unique.
${publisherUrl}

You received this email because you requested a free copy. If you didn't request this, please ignore this email.
    `
  }
}

// Template per email di benvenuto (opzionale)
export const getWelcomeEmailTemplate = (data: EmailTemplateData) => {
  const { name = 'there', bookTitle = 'Fish Cannot Carry Guns' } = data

  return {
    subject: `Welcome to ${bookTitle} - Your download is ready!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0f766e, #0891b2, #1e40af); padding: 30px; border-radius: 10px; color: white; text-align: center;">
          <h1 style="margin: 0 0 20px 0; font-size: 28px;">Welcome!</h1>
          <p style="margin: 0; font-size: 18px;">Hi ${name}, your free ebook is ready for download.</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px; text-align: center;">
          <h2 style="color: #0f766e; margin-top: 0;">Thank you for joining us!</h2>
          <p>We're excited to share "${bookTitle}" with you. Check your inbox for the download link.</p>
          
          <div style="margin: 30px 0;">
            <a href="${data.downloadUrl}" 
               style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Download Your Ebook
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">
            If you don't see the download email, check your spam folder.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to ${bookTitle}!

Hi ${name},

Thank you for joining us! We're excited to share "${bookTitle}" with you.

Your download link has been sent to this email address. If you don't see it, please check your spam folder.

Download link: ${data.downloadUrl}

Best regards,
The ${bookTitle} Team
    `
  }
} 