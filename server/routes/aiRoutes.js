import express from 'express';
import {
  chatAssistant,
  resumeAnalyzer,
  codeReviewer,
  blogGenerator,
  pdfSummarizer,
  sqlGenerator,
  imageGenerator,
  getHistory
} from '../controllers/aiController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/chat', chatAssistant);
router.post('/resume-analyzer', upload.single('resumeFile'), resumeAnalyzer);
router.post('/code-reviewer', codeReviewer);
router.post('/blog-generator', blogGenerator);
router.post('/pdf-summarizer', upload.single('pdfFile'), pdfSummarizer);
router.post('/sql-generator', sqlGenerator);
router.post('/image-generator', imageGenerator);
router.get('/history', getHistory);

export default router;
