import { logToDB } from '../services/db/logToDB.js'; 

export default function logRequest(req, res, next) {
    const start = Date.now();
  
    // Wait for the response to finish before logging
    res.on('finish', () => {
      console.log('info', 'Request completed', {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
      });
      
      const durationMs = Date.now() - start;
      
      const logData = {
        timestamp: new Date().toISOString(),
        userId: req.user?.id || req.user?.email || 'anonymous', // Adjust for your auth scheme
        source: 'API',
        action: `${req.method} ${req.originalUrl}`,
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        durationMs:durationMs,
        errorText: res.statusCode >= 400 ? res.statusMessage : null,
        meta: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          referer: req.get('Referer'),
          query: req.query,
          body: req.body // ⚠️ make sure you use body-parser
        }
      };
  
      logToDB(logData)
        .then(() => console.log('Log saved'))
        .catch(err => console.error('Logging failed', err));
    });
  
    next(); // Pass control to the next middleware or route
  }