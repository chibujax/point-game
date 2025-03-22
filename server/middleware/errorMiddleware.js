"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.AppError = exports.notFoundHandler = exports.globalErrorHandler = void 0;
// Global error handler
const globalErrorHandler = (err, _req, res, _next) => {
    // Set default values
    const statusCode = err.statusCode || 500;
    const isProd = process.env.NODE_ENV === 'production';
    // Structure the error response
    const errorResponse = {
        status: 'error',
        message: err.message || 'Something went wrong',
        ...(isProd ? {} : { stack: err.stack })
    };
    // Log error in development
    if (!isProd) {
        console.error('[Error]', err);
    }
    // Send the appropriate response
    res.status(statusCode).json(errorResponse);
};
exports.globalErrorHandler = globalErrorHandler;
// 404 handler for undefined routes
const notFoundHandler = (req, res, _next) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot find ${req.method} ${req.originalUrl}`
    });
};
exports.notFoundHandler = notFoundHandler;
// Helper to create custom API errors
class AppError extends Error {
    constructor(message, statusCode = 400, isOperational = true) {
        super(message);
        Object.defineProperty(this, "statusCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isOperational", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Async error handler wrapper
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
