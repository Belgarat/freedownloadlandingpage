#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '../docs/images');
const BASE_URL = 'http://localhost:3010';

// Assicurati che la directory esista
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Funzione per generare token di test
function generateTestToken() {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: 'test-admin-user',
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 ora
  };
  
  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  // Signature fittizia per test
  const signature = 'test-signature';
  const signatureB64 = Buffer.from(signature).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

const screenshots = [
  {
    name: 'landing-page.png',
    url: '/',
    description: 'Landing page principale',
    requiresAuth: false
  },
  {
    name: 'admin-email-templates.png',
    url: '/admin/email-templates',
    description: 'Gestione template email',
    requiresAuth: true
  },
  {
    name: 'admin-dashboard.png',
    url: '/admin',
    description: 'Dashboard admin',
    requiresAuth: true
  },
  {
    name: 'mobile-view.png',
    url: '/',
    description: 'Vista mobile',
    viewport: { width: 375, height: 667 },
    requiresAuth: false
  }
];

async function generateScreenshots() {
  console.log('📸 Starting screenshot generation...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  try {
    for (const screenshot of screenshots) {
      console.log(`📸 Generating ${screenshot.name}...`);
      
      const page = await context.newPage();
      
      // Imposta viewport se specificato
      if (screenshot.viewport) {
        await page.setViewportSize(screenshot.viewport);
      } else {
        await page.setViewportSize({ width: 1200, height: 800 });
      }
      
      // Se richiede autenticazione, imposta il token
      if (screenshot.requiresAuth) {
        const token = generateTestToken();
        await page.addInitScript((token) => {
          localStorage.setItem('admin-token', token);
        }, token);
      }
      
      // Naviga alla pagina
      await page.goto(`${BASE_URL}${screenshot.url}`);
      
      // Aspetta che la pagina si carichi
      await page.waitForLoadState('networkidle');
      
      // Per pagine admin, aspetta che il contenuto sia visibile
      if (screenshot.requiresAuth) {
        try {
          await page.waitForSelector('h1, .admin-content, .email-templates', { timeout: 5000 });
        } catch (error) {
          console.log(`⚠️  Timeout waiting for content on ${screenshot.name}, proceeding anyway...`);
        }
      }
      
      // Prendi screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshot.name);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`✅ Generated: ${screenshot.name}`);
      await page.close();
    }
    
    console.log('🎉 All screenshots generated successfully!');
    console.log(`📁 Screenshots saved in: ${SCREENSHOTS_DIR}`);
    
  } catch (error) {
    console.error('❌ Error generating screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Esegui solo se lo script è chiamato direttamente
if (require.main === module) {
  generateScreenshots();
}

module.exports = { generateScreenshots };
