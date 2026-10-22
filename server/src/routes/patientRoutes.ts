import { Router } from 'express';
import { getPatients } from '../controllers/patientController.js';

const router = Router();

router.post('/search', getPatients, (_req, res) => {
  res.status(200).json({
    success: true,
    data: res.locals.patientBundle,
  });
});

export default router;
