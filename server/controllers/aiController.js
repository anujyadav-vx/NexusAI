import { AIService } from '../services/aiService.js';
import { db } from '../services/dbAdapter.js';

// Helper to check user quota and record consumption
const deductTokensAndLog = (user, tool, title, tokensUsed) => {
  const newTokensUsed = (user.tokensUsed || 0) + tokensUsed;
  db.update('users', user.id, { tokensUsed: newTokensUsed });

  const aiLog = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    tool,
    title,
    tokensUsed,
    createdAt: new Date().toISOString(),
    status: 'completed'
  };

  db.insert('aiRequests', aiLog);
  return aiLog;
};

export const chatAssistant = async (req, res) => {
  try {
    const { messages, persona } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required.' });
    }

    // Check token quota
    if (req.user.tokensUsed >= req.user.tokenLimit) {
      return res.status(403).json({
        success: false,
        message: 'Token quota exceeded for your current plan. Please upgrade your subscription to continue using AI tools.'
      });
    }

    const result = await AIService.chatAssistant({ messages, persona, customHeaders: req.headers });
    const latestUserMsg = messages[messages.length - 1]?.content || 'Chat session';
    deductTokensAndLog(req.user, 'chatAssistant', latestUserMsg.slice(0, 40) + '...', result.tokensUsed);

    return res.json({
      success: true,
      data: result,
      tokensUsed: result.tokensUsed,
      userTokensTotal: (req.user.tokensUsed || 0) + result.tokensUsed
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ success: false, message: 'AI Chat failed to process.' });
  }
};

export const resumeAnalyzer = async (req, res) => {
  try {
    let resumeText = req.body.resumeText;
    const targetRole = req.body.targetRole || 'Full Stack Engineer';

    // If file was uploaded via multer
    if (req.file) {
      resumeText = req.file.buffer.toString('utf8');
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resume text (at least 20 characters) or upload a valid resume document.'
      });
    }

    if (req.user.tokensUsed >= req.user.tokenLimit) {
      return res.status(403).json({ success: false, message: 'Token quota exceeded. Please upgrade your plan.' });
    }

    const result = await AIService.resumeAnalyzer({ resumeText, targetRole, customHeaders: req.headers });
    deductTokensAndLog(req.user, 'resumeAnalyzer', `Resume analysis for ${targetRole}`, result.tokensUsed);

    return res.json({
      success: true,
      data: result,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('Resume analyzer error:', error);
    return res.status(500).json({ success: false, message: 'Failed to analyze resume.' });
  }
};

export const codeReviewer = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || code.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Code snippet is required.' });
    }

    if (req.user.tokensUsed >= req.user.tokenLimit) {
      return res.status(403).json({ success: false, message: 'Token quota exceeded. Please upgrade your plan.' });
    }

    const result = await AIService.codeReviewer({ code, language: language || 'javascript', customHeaders: req.headers });
    deductTokensAndLog(req.user, 'codeReviewer', `Code Review (${language || 'code'})`, result.tokensUsed);

    return res.json({
      success: true,
      data: result,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('Code review error:', error);
    return res.status(500).json({ success: false, message: 'Failed to complete code review.' });
  }
};

export const blogGenerator = async (req, res) => {
  try {
    const { topic, tone, audience, length } = req.body;
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Article topic is required.' });
    }

    if (req.user.tokensUsed >= req.user.tokenLimit) {
      return res.status(403).json({ success: false, message: 'Token quota exceeded. Please upgrade your plan.' });
    }

    const result = await AIService.blogGenerator({ topic, tone, audience, length, customHeaders: req.headers });
    deductTokensAndLog(req.user, 'blogGenerator', `Article: ${topic.slice(0, 35)}...`, result.tokensUsed);

    return res.json({
      success: true,
      data: result,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('Blog generator error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate blog content.' });
  }
};

export const pdfSummarizer = async (req, res) => {
  try {
    let text = req.body.text;
    let documentName = req.body.documentName || 'Document.pdf';
    const query = req.body.query || '';

    if (req.file) {
      text = req.file.buffer.toString('utf8');
      documentName = req.file.originalname;
    }

    if (!text || text.trim().length < 20) {
      text = "Annual Technology Strategy: Enterprise cloud scaling, AI automation architectures, and data security governance.";
    }

    if (req.user.tokensUsed >= req.user.tokenLimit) {
      return res.status(403).json({ success: false, message: 'Token quota exceeded. Please upgrade your plan.' });
    }

    const result = await AIService.pdfSummarizer({ text, documentName, query, customHeaders: req.headers });
    deductTokensAndLog(req.user, 'pdfSummarizer', `Summary: ${documentName}`, result.tokensUsed);

    return res.json({
      success: true,
      data: result,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('PDF summarizer error:', error);
    return res.status(500).json({ success: false, message: 'Failed to summarize document.' });
  }
};

export const sqlGenerator = async (req, res) => {
  try {
    const { prompt, dialect, schema } = req.body;
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Natural language prompt is required.' });
    }

    if (req.user.tokensUsed >= req.user.tokenLimit) {
      return res.status(403).json({ success: false, message: 'Token quota exceeded. Please upgrade your plan.' });
    }

    const result = await AIService.sqlGenerator({ prompt, dialect, schema, customHeaders: req.headers });
    deductTokensAndLog(req.user, 'sqlGenerator', `SQL: ${prompt.slice(0, 30)}...`, result.tokensUsed);

    return res.json({
      success: true,
      data: result,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('SQL generator error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate SQL.' });
  }
};

export const imageGenerator = async (req, res) => {
  try {
    const { prompt, style, aspectRatio } = req.body;
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Image prompt is required.' });
    }

    if (req.user.tokensUsed >= req.user.tokenLimit) {
      return res.status(403).json({ success: false, message: 'Token quota exceeded. Please upgrade your plan.' });
    }

    const result = await AIService.imageGenerator({ prompt, style, aspectRatio });
    deductTokensAndLog(req.user, 'imageGenerator', `Image: ${prompt.slice(0, 30)}...`, result.tokensUsed);

    return res.json({
      success: true,
      data: result,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('Image generator error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate image.' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const requests = db.getCollection('aiRequests')
      .filter(r => r.userId === req.user.id)
      .slice(0, 50);

    return res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch AI history.' });
  }
};

export const testAiConnection = async (req, res) => {
  try {
    const { provider, apiKey } = req.body;
    const keyToTest = apiKey || (provider === 'gemini' ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY);
    const result = await AIService.testConnection({ provider, apiKey: keyToTest });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAiStatus = (req, res) => {
  const active = AIService.getActiveProvider(req.headers);
  const dbStatus = db.getDbStatus();

  return res.json({
    success: true,
    data: {
      provider: active.provider,
      hasServerKey: active.provider !== 'nexus-generative-core',
      activeModel: active.provider === 'gemini' ? (process.env.GEMINI_MODEL || 'gemini-1.5-flash') : active.provider === 'openai' ? (process.env.OPENAI_MODEL || 'gpt-4o-mini') : 'nexus-offline-core',
      database: dbStatus
    }
  });
};
