import { NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check system health
 *     description: Check the health status of the system including database connectivity
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 message:
 *                   type: string
 *                   example: "All systems operational"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 14.563479125
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 responseTime:
 *                   type: string
 *                   example: "9ms"
 *                 checks:
 *                   type: object
 *                   properties:
 *                     environment:
 *                       type: string
 *                       example: "ok"
 *                     database:
 *                       type: string
 *                       example: "ok"
 *                     api:
 *                       type: string
 *                       example: "ok"
 *       500:
 *         description: System is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  const startTime = Date.now()
  
  try {
    // Get database adapter (automatically chooses provider based on ENV)
    const adapter = getDatabaseAdapter()
    
    // Check database connection
    try {
      await adapter.getABTests()
    } catch (dbError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: dbError instanceof Error ? dbError.message : 'Unknown database error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
      }, { status: 500 })
    }

    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'healthy',
      message: 'All systems operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      responseTime: `${responseTime}ms`,
      checks: {
        environment: 'ok',
        database: 'ok',
        api: 'ok'
      }
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      responseTime: `${responseTime}ms`
    }, { status: 500 })
  }
}
