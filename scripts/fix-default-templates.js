#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = '/tmp/development.db'

async function fixDefaultTemplates() {
  console.log('🔧 Starting default templates fix...')
  
  const db = new sqlite3.Database(DB_PATH)
  
  try {
    // Get all templates grouped by type
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
    
    console.log('📊 Found templates:', templates.length)
    
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
      console.log(`  ${type}: ${typeTemplates.length} templates`)
    })
    
    // Fix each type
    for (const [type, typeTemplates] of Object.entries(templatesByType)) {
      console.log(`\n🔧 Fixing ${type} templates...`)
      
      // Find the oldest template of this type
      const oldestTemplate = typeTemplates.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      )[0]
      
      console.log(`  📌 Keeping oldest template as default: ${oldestTemplate.name} (ID: ${oldestTemplate.id})`)
      
      // Set all templates of this type to not default
      await new Promise((resolve, reject) => {
        db.run(`
          UPDATE email_templates 
          SET is_default = 0 
          WHERE type = ?
        `, [type], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      
      // Set only the oldest template as default
      await new Promise((resolve, reject) => {
        db.run(`
          UPDATE email_templates 
          SET is_default = 1 
          WHERE id = ?
        `, [oldestTemplate.id], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      
      // Delete duplicate templates (keep only the oldest)
      const duplicateIds = typeTemplates
        .filter(t => t.id !== oldestTemplate.id)
        .map(t => t.id)
      
      if (duplicateIds.length > 0) {
        console.log(`  🗑️ Deleting ${duplicateIds.length} duplicate templates:`, duplicateIds)
        
        // Delete placeholders first (due to foreign key constraints)
        for (const templateId of duplicateIds) {
          await new Promise((resolve, reject) => {
            db.run(`
              DELETE FROM template_placeholders 
              WHERE template_id = ?
            `, [templateId], (err) => {
              if (err) reject(err)
              else resolve()
            })
          })
        }
        
        // Delete templates
        const placeholders = duplicateIds.map(() => '?').join(',')
        await new Promise((resolve, reject) => {
          db.run(`
            DELETE FROM email_templates 
            WHERE id IN (${placeholders})
          `, duplicateIds, (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
      }
    }
    
    // Verify the result
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
    
    console.log('\n✅ Default templates fix completed!')
    console.log('\n📊 Final template structure:')
    finalTemplates.forEach(template => {
      const defaultFlag = template.is_default ? ' (DEFAULT)' : ''
      console.log(`  ${template.id}: ${template.name} - ${template.type}${defaultFlag}`)
    })
    
  } catch (error) {
    console.error('❌ Error fixing default templates:', error)
  } finally {
    db.close()
  }
}

fixDefaultTemplates()
