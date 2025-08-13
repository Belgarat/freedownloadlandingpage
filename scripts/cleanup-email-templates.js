const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = '/tmp/development.db'
const db = new sqlite3.Database(dbPath)

async function cleanupEmailTemplates() {
  console.log('🧹 Starting email templates cleanup...')
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Find all duplicate templates by name and type
      db.all(`
        SELECT name, type, COUNT(*) as count, GROUP_CONCAT(id) as ids
        FROM email_templates 
        GROUP BY name, type 
        HAVING COUNT(*) > 1
        ORDER BY name, type
      `, [], (err, duplicates) => {
        if (err) {
          console.error('❌ Error finding duplicates:', err)
          reject(err)
          return
        }
        
        console.log(`📊 Found ${duplicates.length} groups of duplicate templates`)
        
        // 2. For each group of duplicates, keep the most recent one and delete the rest
        duplicates.forEach((duplicate, index) => {
          const ids = duplicate.ids.split(',').map(id => parseInt(id)).sort((a, b) => b - a)
          const keepId = ids[0] // Keep the highest ID (most recent)
          const deleteIds = ids.slice(1) // Delete the rest
          
          console.log(`\n📧 Processing: ${duplicate.name} (${duplicate.type})`)
          console.log(`   Keeping ID: ${keepId}`)
          console.log(`   Deleting IDs: ${deleteIds.join(', ')}`)
          
          // Delete duplicates
          const placeholders = deleteIds.map(() => '?').join(',')
          db.run(`
            DELETE FROM email_templates 
            WHERE id IN (${placeholders})
          `, deleteIds, function(err) {
            if (err) {
              console.error(`❌ Error deleting duplicates for ${duplicate.name}:`, err)
            } else {
              console.log(`   ✅ Deleted ${this.changes} duplicate templates`)
            }
          })
        })
        
        // 3. Create fallback template
        setTimeout(() => {
          createFallbackTemplate()
            .then(() => {
              console.log('\n✅ Email templates cleanup completed!')
              resolve()
            })
            .catch(reject)
        }, 1000) // Wait for deletions to complete
      })
    })
  })
}

async function createFallbackTemplate() {
  console.log('\n📝 Creating fallback email template...')
  
  const fallbackTemplate = {
    name: 'Fallback Email Template',
    subject: 'Important Information',
    html_content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Important Information</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #2c3e50; margin-top: 0;">Important Information</h1>
        
        <p>Hello {{user_name}},</p>
        
        <p>This is a fallback email template that will be used when the primary template is not available.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
            <h3 style="margin-top: 0; color: #2c3e50;">⚠️ Fallback Notice</h3>
            <p>If you're seeing this template, it means there was an issue with the primary email template. Please contact support if this persists.</p>
        </div>
        
        <p>Thank you for your understanding.</p>
        
        <p>Best regards,<br>
        <strong>The {{site_name}} Team</strong></p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <div style="text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated fallback email from {{site_name}}.</p>
        </div>
    </div>
</body>
</html>`,
    text_content: `Hello {{user_name}},

This is a fallback email template that will be used when the primary template is not available.

⚠️ Fallback Notice
If you're seeing this template, it means there was an issue with the primary email template. Please contact support if this persists.

Thank you for your understanding.

Best regards,
The {{site_name}} Team

---
This is an automated fallback email from {{site_name}}.`,
    description: 'Fallback template used when primary templates are not available',
    is_default: 0,
    type: 'fallback',
    created_at: new Date().toISOString().replace('T', ' ').replace('Z', ''),
    updated_at: new Date().toISOString().replace('T', ' ').replace('Z', '')
  }
  
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO email_templates (
        name, subject, html_content, text_content, description, 
        is_default, type, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      fallbackTemplate.name,
      fallbackTemplate.subject,
      fallbackTemplate.html_content,
      fallbackTemplate.text_content,
      fallbackTemplate.description,
      fallbackTemplate.is_default,
      fallbackTemplate.type,
      fallbackTemplate.created_at,
      fallbackTemplate.updated_at
    ], function(err) {
      if (err) {
        console.error('❌ Error creating fallback template:', err)
        reject(err)
      } else {
        console.log(`✅ Created fallback template with ID: ${this.lastID}`)
        resolve()
      }
    })
  })
}

async function showTemplateSummary() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT type, COUNT(*) as count
      FROM email_templates 
      GROUP BY type
      ORDER BY type
    `, [], (err, results) => {
      if (err) {
        reject(err)
        return
      }
      
      console.log('\n📊 Email Templates Summary:')
      results.forEach(result => {
        console.log(`   ${result.type}: ${result.count} templates`)
      })
      resolve()
    })
  })
}

// Run the cleanup
cleanupEmailTemplates()
  .then(() => showTemplateSummary())
  .then(() => {
    console.log('\n🎉 Cleanup completed successfully!')
    db.close()
  })
  .catch((err) => {
    console.error('❌ Cleanup failed:', err)
    db.close()
    process.exit(1)
  })
