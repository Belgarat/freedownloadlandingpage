#!/usr/bin/env node

/**
 * Complete Admin API Test Suite
 * Tests all CRUD operations for all configuration types
 * Includes automatic cleanup of test data
 */

const BASE_URL = 'http://localhost:3000/api/config'

// Test data for each configuration type
const testData = {
  marketing: {
    name: 'Test Marketing Config',
    description: 'Test marketing configuration for API testing',
    cta_config: {
      primary: {
        text: 'Test Download',
        subtext: 'Test subtext',
        loadingText: 'Loading...',
        successText: 'Success!',
        errorText: 'Error!'
      },
      social: {
        goodreads: {
          text: 'Test Goodreads',
          url: 'https://test.com',
          icon: 'goodreads',
          tracking: 'test_tracking'
        },
        amazon: {
          text: 'Test Amazon',
          url: 'https://test.com',
          icon: 'amazon',
          tracking: 'test_tracking'
        },
        publisher: {
          text: 'Test Publisher',
          url: 'https://test.com',
          icon: 'publisher',
          tracking: 'test_tracking'
        }
      },
      newsletter: {
        text: 'Test Newsletter',
        placeholder: 'Test placeholder',
        url: 'https://test.com',
        tracking: 'test_tracking'
      }
    },
    modal_config: {
      success: {
        title: 'Test Success',
        message: 'Test message',
        buttonText: 'Test Button'
      },
      error: {
        title: 'Test Error',
        message: 'Test error message',
        buttonText: 'Test Error Button'
      }
    },
    offer_config: {
      endDate: '2025-12-31T23:59:59Z',
      isLimited: true,
      limitedText: 'Test limited offer'
    },
    social_proof_config: {
      showRating: true,
      showReviewCount: true,
      showRankings: true,
      showAwards: true
    }
  },
  theme: {
    name: 'Test Theme Config',
    description: 'Test theme configuration for API testing',
    colors: {
      primary: '#FF0000',
      secondary: '#00FF00',
      accent: '#0000FF',
      background: '#FFFFFF',
      text: {
        primary: '#000000',
        secondary: '#666666',
        muted: '#999999'
      },
      success: '#00FF00',
      error: '#FF0000',
      warning: '#FFFF00'
    },
    fonts: {
      heading: 'serif',
      body: 'system-ui',
      mono: 'monospace'
    },
    layout: {
      type: 'sidebar',
      showCountdown: true,
      showStories: true,
      showTestimonials: true,
      showAwards: true
    },
    spacing: {
      container: 'max-w-7xl',
      section: 'py-20',
      element: 'mb-6'
    },
    animations: {
      enabled: true,
      duration: '300ms',
      easing: 'ease-in-out'
    },
    development: {
      debug: false,
      hotReload: true
    },
    surface: {
      mode: 'auto'
    }
  },
  content: {
    language: 'en',
    name: 'Test Content Config',
    about_book: 'Test about book content',
    author_bio: 'Test author bio content',
    stories: [
      {
        title: 'Test Story 1',
        description: 'Test story description 1',
        content: 'Test story content 1'
      }
    ],
    testimonials: [
      {
        text: 'Test testimonial 1',
        author: 'Test Author 1',
        rating: 5,
        source: 'Test Source 1'
      }
    ],
    footer: {
      copyright: 'Test Copyright 2025',
      supportText: 'Test support text'
    }
  },
  book: {
    name: 'Test Book Config',
    description: 'Test book configuration for API testing',
    title: 'Test Book Title',
    subtitle: 'Test Book Subtitle',
    author: 'Test Author',
    author_bio: 'Test author bio',
    publisher: 'Test Publisher',
    publisher_url: 'https://test.com',
    publisher_tagline: 'Test tagline',
    substack_name: 'Test Substack',
    description_content: 'Test book description content',
    cover_image: 'https://test.com/cover.jpg',
    rating: 4.5,
    review_count: 10,
    publication_date: '2025-01-01',
    isbn: '1234567890',
    asin: 'B0TEST123',
    amazon_url: 'https://test.com/amazon',
    goodreads_url: 'https://test.com/goodreads',
    substack_url: 'https://test.com/substack',
    file_size: '2.5 MB',
    page_count: 200,
    language: 'English',
    format: 'PDF',
    is_free: true,
    price: null,
    categories: ['Test', 'Fiction'],
    stories: [
      {
        title: 'Test Story',
        description: 'Test story description'
      }
    ],
    awards: [
      {
        title: 'Test Award',
        type: 'Winner'
      }
    ],
    rankings: {
      kindleStore: '#1',
      sciFiAnthologies: '#2'
    },
    ebook: {
      defaultFormat: 'pdf',
      pdf: {
        url: 'https://test.com/book.pdf',
        filename: 'test-book.pdf',
        size: '2.5 MB',
        uploadedAt: '2025-01-01T00:00:00Z'
      }
    }
  },
  seo: {
    name: 'Test SEO Config',
    description: 'Test SEO configuration for API testing',
    meta: {
      title: 'Test SEO Title',
      description: 'Test SEO description',
      keywords: 'test,seo,keywords',
      author: 'Test Author',
      robots: 'index, follow',
      canonical: 'https://test.com'
    },
    openGraph: {
      title: 'Test OG Title',
      description: 'Test OG description',
      type: 'website',
      url: 'https://test.com',
      image: 'https://test.com/og-image.jpg',
      siteName: 'Test Site'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Test Twitter Title',
      description: 'Test Twitter description',
      image: 'https://test.com/twitter-image.jpg'
    },
    structured_data: {
      book: {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: 'Test Book',
        author: {
          '@type': 'Person',
          name: 'Test Author'
        }
      }
    },
    sitemap: {
      enabled: true,
      priority: 1.0,
      changefreq: 'weekly'
    }
  },
  email: {
    name: 'Test Email Config',
    description: 'Test email configuration for API testing',
    sender: {
      name: 'Test Sender',
      email: 'test@example.com',
      replyTo: 'reply@example.com'
    },
    templates: {
      download: {
        subject: 'Test Download Subject',
        html: '<p>Test download HTML</p>',
        text: 'Test download text',
        message: 'Test download message'
      },
      followup: {
        subject: 'Test Followup Subject',
        html: '<p>Test followup HTML</p>',
        text: 'Test followup text'
      }
    },
    settings: {
      templateExpiryHours: 24,
      maxRetries: 3,
      tracking: false
    }
  }
}

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`)
  }
  
  return data
}

// Test results storage
const testResults = {
  created: [],
  passed: 0,
  failed: 0,
  errors: []
}

// Test function for each configuration type
async function testConfigType(type) {
  console.log(`\n🧪 Testing ${type.toUpperCase()} configuration...`)
  
  try {
    // 1. CREATE
    console.log(`  📝 Creating ${type} config...`)
    const createResponse = await makeRequest(`${BASE_URL}/${type}`, {
      method: 'POST',
      body: JSON.stringify(testData[type])
    })
    
    if (!createResponse.success) {
      throw new Error(`Failed to create ${type} config: ${createResponse.error}`)
    }
    
    const createdId = createResponse.data.id
    testResults.created.push({ type, id: createdId })
    console.log(`  ✅ Created ${type} config with ID: ${createdId}`)
    
    // 2. READ
    console.log(`  📖 Reading ${type} config...`)
    const readResponse = await makeRequest(`${BASE_URL}/${type}/${createdId}`)
    
    if (!readResponse.success) {
      throw new Error(`Failed to read ${type} config: ${readResponse.error}`)
    }
    
    console.log(`  ✅ Read ${type} config successfully`)
    
    // 3. UPDATE
    console.log(`  ✏️  Updating ${type} config...`)
    const updateData = { ...testData[type], name: `Updated ${testData[type].name}` }
    const updateResponse = await makeRequest(`${BASE_URL}/${type}/${createdId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })
    
    if (!updateResponse.success) {
      throw new Error(`Failed to update ${type} config: ${updateResponse.error}`)
    }
    
    console.log(`  ✅ Updated ${type} config successfully`)
    
    // 4. VERIFY UPDATE
    console.log(`  🔍 Verifying update...`)
    const verifyResponse = await makeRequest(`${BASE_URL}/${type}/${createdId}`)
    
    if (!verifyResponse.success) {
      throw new Error(`Failed to verify ${type} config update: ${verifyResponse.error}`)
    }
    
    if (verifyResponse.data.name !== `Updated ${testData[type].name}`) {
      throw new Error(`Update verification failed: expected "Updated ${testData[type].name}", got "${verifyResponse.data.name}"`)
    }
    
    console.log(`  ✅ Update verified successfully`)
    
    // 5. DELETE
    console.log(`  🗑️  Deleting ${type} config...`)
    const deleteResponse = await makeRequest(`${BASE_URL}/${type}/${createdId}`, {
      method: 'DELETE'
    })
    
    if (!deleteResponse.success) {
      throw new Error(`Failed to delete ${type} config: ${deleteResponse.error}`)
    }
    
    console.log(`  ✅ Deleted ${type} config successfully`)
    
    // 6. VERIFY DELETE
    console.log(`  🔍 Verifying deletion...`)
    try {
      await makeRequest(`${BASE_URL}/${type}/${createdId}`)
      throw new Error(`Config should have been deleted but still exists`)
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('not found')) {
        console.log(`  ✅ Deletion verified successfully`)
      } else {
        throw error
      }
    }
    
    testResults.passed++
    console.log(`  🎉 ${type.toUpperCase()} test PASSED`)
    
  } catch (error) {
    testResults.failed++
    testResults.errors.push({ type, error: error.message })
    console.log(`  ❌ ${type.toUpperCase()} test FAILED: ${error.message}`)
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Admin API Test Suite...')
  console.log(`📍 Base URL: ${BASE_URL}`)
  
  const configTypes = ['marketing', 'theme', 'content', 'book', 'seo', 'email']
  
  for (const type of configTypes) {
    await testConfigType(type)
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY')
  console.log('===============')
  console.log(`✅ Passed: ${testResults.passed}`)
  console.log(`❌ Failed: ${testResults.failed}`)
  console.log(`📝 Total: ${testResults.passed + testResults.failed}`)
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ ERRORS:')
    testResults.errors.forEach(({ type, error }) => {
      console.log(`  ${type}: ${error}`)
    })
  }
  
  if (testResults.passed === configTypes.length) {
    console.log('\n🎉 ALL TESTS PASSED! Admin APIs are working correctly.')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.')
  }
}

// Run tests
runTests().catch(console.error)
