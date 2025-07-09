import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Rate limiting middleware to prevent brute force attacks
 * Simple implementation for demonstration purposes
 */
export const rateLimit = (windowMs = 60000, maxRequests = 30): RequestHandler => {
    const requests: Record<string, number[]> = {};
    
    return (req: Request, res: Response, next: NextFunction): void => {
        const ip = req.ip || req.socket.remoteAddress || '';
        const now = Date.now();
        
        requests[ip] = requests[ip] || [];
        requests[ip] = requests[ip].filter(time => now - time < windowMs);
        
        if (requests[ip].length >= maxRequests) {
            res.status(429).json({ 
                error: 'Too many requests, please try again later' 
            });
            return;
        }
        
        requests[ip].push(now);
        next();
    };
};

/**
 * Simple request sanitization middleware
 */
export const sanitizeRequest: RequestHandler = (req: Request, _res: Response, next: NextFunction): void => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim().replace(/[\x00-\x1F\x7F]/g, '');
            }
        });
    }
    
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = (req.query[key] as string).trim().replace(/[\x00-\x1F\x7F]/g, '');
            }
        });
    }
    
    next();
};

/**
 * Add security headers middleware
 */
export const securityHeaders: RequestHandler = (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " + 
        "script-src 'self' https://cdnjs.cloudflare.com; " +
        "connect-src 'self' wss:; " +
        "img-src 'self' data: https: http:; " +  // Allow images from all sources
        "font-src 'self' data:;"
    );
    
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    next();
};

/**
 * Basic input validation for all requests
 */
export const basicValidation: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > 1000000) { // 1MB limit
        res.status(413).json({ error: 'Request entity too large' });
        return;
    }


    if (req.is('application/json') && req.body) {
        try {
            JSON.parse(JSON.stringify(req.body));
        } catch (e) {
            res.status(400).json({ error: 'Invalid JSON payload' });
            return;
        }
    }
    
    next();
};
