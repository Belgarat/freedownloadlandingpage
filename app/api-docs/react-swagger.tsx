'use client'

import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

type Props = {
  spec: Record<string, any>
}

function ReactSwagger({ spec }: Props) {
  return (
    <SwaggerUI 
      spec={spec}
      docExpansion="list"
      defaultModelsExpandDepth={2}
      defaultModelExpandDepth={2}
      tryItOutEnabled={true}
      displayRequestDuration={true}
      filter={true}
      showExtensions={true}
      showCommonExtensions={true}
      requestInterceptor={(request) => {
        // Add base URL for try-it-out functionality
        if (!request.url.startsWith('http')) {
          request.url = `${window.location.origin}${request.url}`
        }
        return request
      }}
      responseInterceptor={(response) => {
        return response
      }}
      onComplete={(system) => {
        console.log('Swagger UI loaded successfully')
      }}
    />
  )
}

export default ReactSwagger
