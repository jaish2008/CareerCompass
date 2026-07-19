/**
 * aiRoutes.js
 * ---------------------------------------------------------
 * Express routes for the AI Assistant page. Mount in server.js:
 *
 *   const aiRoutes = require('./airoutes');
 *   app.use('/api/ai', aiRoutes);
 * ---------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const {
  generateCareerQuiz,
  generateRecommendation,
  generateLearningPlan,
  chatReply
} = require('./geminiservice');

router.get('/quiz', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const questions = await generateCareerQuiz(count);
    res.json({ questions });
  } catch (err) {
    console.error('Quiz generation failed:', err.message);
    res.status(500).json({ error: 'Could not generate quiz right now.' });
  }
});

router.post('/recommend', async (req, res) => {
  try {
    const recommendation = await generateRecommendation(req.body);
    res.json({ recommendation });
  } catch (err) {
    console.error('Recommendation generation failed:', err.message);
    res.status(500).json({ error: 'Could not generate recommendation right now.' });
  }
});

router.post('/learning-plan', async (req, res) => {
  try {
    const { skillGaps } = req.body;
    const plan = await generateLearningPlan(skillGaps);
    res.json({ plan });
  } catch (err) {
    console.error('Learning plan generation failed:', err.message);
    res.status(500).json({ error: 'Could not generate learning plan right now.' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { history, systemInstruction } = req.body;
    const reply = await chatReply(history, systemInstruction);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

module.exports = router;

