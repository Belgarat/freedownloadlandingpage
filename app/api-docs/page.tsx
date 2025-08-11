import { getApiDocs } from '@/lib/swagger'
import ReactSwagger from './react-swagger'

export default async function ApiDocsPage() {
  const spec = await getApiDocs()
  
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Book Landing Stack API Documentation</h1>
          <p className="text-gray-300 mt-2">
            Interactive API documentation with try-it-out functionality
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-green-600 text-white rounded text-sm">
              Next-Swagger-Doc Version
            </span>
            <a 
              href="/api-docs-simple" 
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Iframe Version
            </a>
          </div>
        </div>
      </div>
      
      <div className="swagger-container">
        <ReactSwagger spec={spec} />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          /* Container styles */
          .swagger-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          /* Ensure proper spacing */
          .swagger-container > div {
            margin: 0;
            padding: 0;
          }
        `
      }} />
    </div>
  )
}
