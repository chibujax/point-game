"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicValidation = exports.securityHeaders = exports.sanitizeRequest = exports.rateLimit = void 0;
/**
 * Rate limiting middleware to prevent brute force attacks
 * Simple implementation for demonstration purposes
 */
const rateLimit = (windowMs = 60000, maxRequests = 30) => {
    const requests = {};
    return (req, res, next) => {
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
exports.rateLimit = rateLimit;
/**
 * Simple request sanitization middleware
 */
const sanitizeRequest = (req, _res, next) => {
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
                req.query[key] = req.query[key].trim().replace(/[\x00-\x1F\x7F]/g, '');
            }
        });
    }
    next();
};
exports.sanitizeRequest = sanitizeRequest;
/**
 * Add security headers middleware
 */
const securityHeaders = (_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "script-src 'self' https://cdnjs.cloudflare.com; " +
        "connect-src 'self' wss:; " +
        "img-src 'self' data:; " +
        "font-src 'self' data:;");
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
};
exports.securityHeaders = securityHeaders;
/**
 * Basic input validation for all requests
 */
const basicValidation = (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > 1000000) { // 1MB limit
        res.status(413).json({ error: 'Request entity too large' });
        return;
    }
    if (req.is('application/json') && req.body) {
        try {
            // If body-parser fails, this will already be caught earlier
            // This is an extra check for JSON validity
            JSON.parse(JSON.stringify(req.body));
        }
        catch (e) {
            res.status(400).json({ error: 'Invalid JSON payload' });
            return;
        }
    }
    next();
};
exports.basicValidation = basicValidation;
