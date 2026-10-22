import type { ErrorRequestHandler } from 'express';
import AppError from './AppError.js';

// Global Express error handler
export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isAppError = err instanceof AppError;
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (isAppError) {
    statusCode = err.statusCode;
    if (statusCode < 500) message = err.message;
  } else if (err?.status === 400) {
    statusCode = 400;
    message = 'Invalid JSON';
  } else if (err?.status === 413) {
    statusCode = 413;
    message = 'Request body too large';
  }

  if (isAppError) {
    console.error('Message:', err.message);
    if (err.log) console.error('Log:', err.log);
  } else {
    console.error('Unexpected server error:', err.name);
  }
  res.status(statusCode).json({
    success: false,
    message,
  });
};
