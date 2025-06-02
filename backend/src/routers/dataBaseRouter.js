import { Router } from 'express';
import { getPrinters, getUsers, getRequests } from '../controllers/dataBaseControllers.js';

const router = Router();

router.post('/printers', getPrinters);
router.post('/users', getUsers);
router.post('/requests', getRequests);

export default router;