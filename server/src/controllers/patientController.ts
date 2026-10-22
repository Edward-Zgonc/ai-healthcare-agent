import type { RequestHandler } from 'express';
import { searchPatients } from '../services/epicFhir.js';
import { PatientSearchParamsSchema } from '../schemas/patientSearch.js';
import AppError from '../errors/AppError.js';
import { z } from 'zod';

export const getPatients: RequestHandler = async (req, res, next) => {
  const result = PatientSearchParamsSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError('Invalid patient search parameters', 400, {
      log: 'patientController.getPatients: Invalid parameters\n' + z.prettifyError(result.error),
    });
  }

  const data = await searchPatients(result.data);
  res.locals.patientBundle = data;
  return next();
};
