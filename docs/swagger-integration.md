# Swagger API Documentation

Book Landing Stack includes comprehensive API documentation powered by Swagger/OpenAPI 3.0.

## Overview

The Swagger integration provides:

- **Interactive API Documentation** - Test endpoints directly from the browser
- **Automatic Schema Generation** - OpenAPI specification from JSDoc comments
- **Type Safety** - Complete request/response schemas
- **Code Generation** - Generate client SDKs in multiple languages

## Accessing the Documentation

### Interactive Documentation

Visit the interactive API documentation at:

```
http://localhost:3000/api-docs
```

This provides a full Swagger UI interface where you can:

- Browse all available endpoints
- Test API calls directly
- View request/response schemas
- Download the OpenAPI specification

### Raw OpenAPI Specification

Get the raw OpenAPI JSON specification at:

```
http://localhost:3000/api/docs/swagger.json
```

This can be used for:

- Code generation tools
- API client libraries
- Integration with other tools

## Adding Documentation to New Endpoints

### Basic JSDoc Comments

Add JSDoc comments to your API route files:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export async function GET() {
  // Your implementation
}
```

### Request Body Documentation

For POST/PUT endpoints with request bodies:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Create resource
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
```

### Using Schema References

Define reusable schemas in `lib/swagger.ts`:

```typescript
components: {
  schemas: {
    YourSchema: {
      type: 'object',
      required: ['field1'],
      properties: {
        field1: {
          type: 'string',
          example: 'example value'
        },
        field2: {
          type: 'number',
          example: 42
        }
      }
    }
  }
}
```

Then reference them in your endpoints:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 */
```

## Testing the Documentation

### Automated Tests

Run the Swagger documentation tests:

```bash
npm run test:swagger
```

This verifies:

- The documentation page loads correctly
- The OpenAPI specification is valid
- All documented endpoints are accessible

### Manual Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the documentation:**
   ```
   http://localhost:3000/api-docs
   ```

3. **Test endpoints:**
   - Click on any endpoint
   - Click "Try it out"
   - Fill in the parameters
   - Click "Execute"

## Code Generation

### Generate Client SDKs

Using the OpenAPI specification, you can generate client libraries:

#### TypeScript/JavaScript

```bash
# Using OpenAPI Generator
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api/docs/swagger.json \
  -g typescript-fetch \
  -o ./generated/typescript-client
```

#### Python

```bash
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api/docs/swagger.json \
  -g python \
  -o ./generated/python-client
```

#### cURL Examples

The Swagger UI automatically generates cURL examples for each endpoint.

## Configuration

### Swagger Configuration

The main configuration is in `lib/swagger.ts`:

```typescript
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Landing Stack API',
      version: '1.0.0',
      description: 'Complete API for Book Landing Stack'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      // Schemas, security schemes, etc.
    }
  },
  apis: [
    './app/api/**/*.ts',
    './lib/**/*.ts'
  ]
}
```

### Customizing the UI

Modify the Swagger UI configuration in `app/api-docs/page.tsx`:

```typescript
<SwaggerUI 
  spec={spec}
  docExpansion="list"           // Expand all endpoints
  defaultModelsExpandDepth={2}  // Show model details
  tryItOutEnabled={true}        // Enable "Try it out" feature
  requestInterceptor={(request) => {
    // Customize requests (e.g., add headers)
    return request
  }}
/>
```

## Best Practices

### Documentation Standards

1. **Always document new endpoints** with JSDoc comments
2. **Use descriptive summaries** and detailed descriptions
3. **Include examples** for all request/response schemas
4. **Group related endpoints** with appropriate tags
5. **Document error responses** for all possible status codes

### Schema Design

1. **Reuse common schemas** (Error, Success, etc.)
2. **Use consistent naming** for properties
3. **Include validation rules** (min/max, patterns, etc.)
4. **Provide meaningful examples**

### Testing

1. **Test all documented endpoints** manually
2. **Verify request/response schemas** match implementation
3. **Check error handling** documentation
4. **Validate generated clients** work correctly

## Troubleshooting

### Common Issues

**Documentation not updating:**
- Restart the development server
- Clear browser cache
- Check for syntax errors in JSDoc comments

**Swagger UI not loading:**
- Verify the OpenAPI spec is valid
- Check browser console for errors
- Ensure all dependencies are installed

**Generated clients not working:**
- Verify the OpenAPI spec is complete
- Check for missing required fields
- Test with the interactive documentation first

### Debugging

1. **Check the raw specification:**
   ```bash
   curl http://localhost:3000/api/docs/swagger.json | jq .
   ```

2. **Validate OpenAPI spec:**
   ```bash
   npx @apidevtools/swagger-parser validate http://localhost:3000/api/docs/swagger.json
   ```

3. **View browser console** for JavaScript errors

## Integration with CI/CD

### Automated Documentation Checks

Add to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Test API Documentation
  run: npm run test:swagger
```

### Documentation Deployment

Deploy the documentation to a static site:

```bash
# Build the documentation page
npm run build

# The documentation will be available at:
# https://yourdomain.com/api-docs
```

## Next Steps

- [API Reference](./api.md) - Complete API documentation
- [API Quick Start](./api-quick-start.md) - Get started with APIs
- [Environment Configuration](./environment.md) - Setup and configuration
- [Testing Guide](./testing.md) - Testing strategies and examples
