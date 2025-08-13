#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose()

const DB_PATH = '/tmp/development.db'

async function ensureDefaultTemplates() {
  console.log('🛡️ Ensuring default templates exist...')
  
  const db = new sqlite3.Database(DB_PATH)
  
  try {
    // Check current templates
    const templates = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, type, is_default, created_at 
        FROM email_templates 
        ORDER BY type, created_at
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
    
    console.log('📊 Current templates:', templates.length)
    
    // Group by type
    const templatesByType = {}
    templates.forEach(template => {
      if (!templatesByType[template.type]) {
        templatesByType[template.type] = []
      }
      templatesByType[template.type].push(template)
    })
    
    console.log('📋 Templates by type:')
    Object.entries(templatesByType).forEach(([type, typeTemplates]) => {
      const defaultCount = typeTemplates.filter(t => t.is_default).length
      console.log(`  ${type}: ${typeTemplates.length} templates (${defaultCount} default)`)
    })
    
    // Ensure each type has exactly one default template
    for (const [type, typeTemplates] of Object.entries(templatesByType)) {
      const defaultTemplates = typeTemplates.filter(t => t.is_default)
      
      if (defaultTemplates.length === 0) {
        console.log(`⚠️ No default template found for type: ${type}`)
        console.log(`   Creating default template for ${type}...`)
        
        // Create default template based on type
        let defaultTemplate
        if (type === 'download') {
          defaultTemplate = {
            name: 'Default Download Email',
            subject: 'Your ebook is ready!',
            html_content: '<p>Hello {{user_name}},</p><p>Your ebook is ready for download!</p>',
            text_content: 'Hello {{user_name}},\n\nYour ebook is ready for download!',
            description: 'Default download email template',
            is_default: 1
          }
        } else if (type === 'followup') {
          defaultTemplate = {
            name: 'Default Follow-up Email',
            subject: 'How are you enjoying the book?',
            html_content: '<p>Hello {{user_name}},</p><p>We hope you are enjoying {{book_title}}!</p><p>How is your reading experience going?</p>',
            text_content: 'Hello {{user_name}},\n\nWe hope you are enjoying {{book_title}}!\n\nHow is your reading experience going?',
            description: 'Default follow-up email template',
            is_default: 1
          }
        } else if (type === 'fallback') {
          defaultTemplate = {
            name: 'Fallback Email Template',
            subject: 'Important Information',
            html_content: '<p>Hello {{user_name}},</p><p>This is a fallback email template.</p>',
            text_content: 'Hello {{user_name}},\n\nThis is a fallback email template.',
            description: 'Fallback template used when primary templates are not available',
            is_default: 1
          }
        } else {
          defaultTemplate = {
            name: `Default ${type.charAt(0).toUpperCase() + type.slice(1)} Template`,
            subject: 'Important Information',
            html_content: '<p>Hello {{user_name}},</p><p>This is a default template.</p>',
            text_content: 'Hello {{user_name}},\n\nThis is a default template.',
            description: `Default ${type} template`,
            is_default: 1
          }
        }
        
        // Insert default template
        await new Promise((resolve, reject) => {
          db.run(`
            INSERT INTO email_templates (name, subject, html_content, text_content, description, is_default, type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            defaultTemplate.name,
            defaultTemplate.subject,
            defaultTemplate.html_content,
            defaultTemplate.text_content,
            defaultTemplate.description,
            defaultTemplate.is_default,
            type
          ], function(err) {
            if (err) reject(err)
            else {
              console.log(`   ✅ Created default template with ID: ${this.lastID}`)
              resolve()
            }
          })
        })
        
      } else if (defaultTemplates.length > 1) {
        console.log(`⚠️ Multiple default templates found for type: ${type}`)
        console.log(`   Keeping oldest default template, removing others...`)
        
        // Keep the oldest default template, remove others
        const oldestDefault = defaultTemplates.sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        )[0]
        
        const otherDefaults = defaultTemplates.filter(t => t.id !== oldestDefault.id)
        
        for (const template of otherDefaults) {
          console.log(`   🗑️ Removing duplicate default template: ${template.name} (ID: ${template.id})`)
          
          // Delete placeholders first
          await new Promise((resolve, reject) => {
            db.run(`
              DELETE FROM template_placeholders 
              WHERE template_id = ?
            `, [template.id], (err) => {
              if (err) reject(err)
              else resolve()
            })
          })
          
          // Delete template
          await new Promise((resolve, reject) => {
            db.run(`
              DELETE FROM email_templates 
              WHERE id = ?
            `, [template.id], (err) => {
              if (err) reject(err)
              else resolve()
            })
          })
        }
      } else {
        console.log(`✅ Type ${type} has exactly one default template`)
      }
    }
    
    // Verify final state
    const finalTemplates = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, type, is_default, created_at 
        FROM email_templates 
        ORDER BY type, created_at
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
    
    console.log('\n✅ Default templates verification completed!')
    console.log('\n📊 Final template structure:')
    finalTemplates.forEach(template => {
      const defaultFlag = template.is_default ? ' (DEFAULT)' : ''
      console.log(`  ${template.id}: ${template.name} - ${template.type}${defaultFlag}`)
    })
    
    // Verify each type has exactly one default
    const finalByType = {}
    finalTemplates.forEach(template => {
      if (!finalByType[template.type]) {
        finalByType[template.type] = []
      }
      finalByType[template.type].push(template)
    })
    
    console.log('\n🔍 Verification by type:')
    for (const [type, typeTemplates] of Object.entries(finalByType)) {
      const defaultCount = typeTemplates.filter(t => t.is_default).length
      if (defaultCount === 1) {
        console.log(`  ✅ ${type}: 1 default template`)
      } else {
        console.log(`  ❌ ${type}: ${defaultCount} default templates (should be 1)`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error ensuring default templates:', error)
  } finally {
    db.close()
  }
}

ensureDefaultTemplates()
