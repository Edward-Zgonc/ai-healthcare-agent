import express from 'express';

import patientRoutes from './routes/patientRoutes.js';
import { globalErrorHandler } from './errors/globalErrorHandler.js';

const app = express();

// Middleware
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

// Patient Routes
app.use('/api/patients', patientRoutes);

// Global Express error handler
app.use(globalErrorHandler);

export { app };
