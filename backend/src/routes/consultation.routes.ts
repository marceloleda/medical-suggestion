import { Router } from 'express';
import { ConsultationController } from '../controllers/consultation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../config/multer';

const router = Router();
const consultationController = new ConsultationController();

// Todas as rotas são protegidas
router.use(authMiddleware);

// CRUD de consultas
router.post('/', (req, res) => consultationController.create(req, res));
router.get('/', (req, res) => consultationController.findAll(req, res));
router.get('/statistics', (req, res) => consultationController.getStatistics(req, res));
router.get('/:id', (req, res) => consultationController.findById(req, res));
router.patch('/:id', (req, res) => consultationController.update(req, res));
router.delete('/:id', (req, res) => consultationController.delete(req, res));

// Upload de áudio
router.post('/:id/audio', upload.single('audio'), (req, res) =>
  consultationController.uploadAudio(req, res)
);

export default router;
