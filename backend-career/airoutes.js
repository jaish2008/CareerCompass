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
  generateLearningPlan
} = require('./geminiservice');

/**
 * GET /api/ai/quiz?count=5
 * Returns a freshly generated set of career quiz questions.
 */
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

/**
 * POST /api/ai/recommend
 * Body: { skills: [...], quizResult: "frontend", topMatchRole: "frontend" }
 * In production, pull skills from the authenticated user's Firestore
 * profile (req.user.uid) instead of trusting the request body directly.
 */
router.post('/recommend', async (req, res) => {
  try {
    const recommendation = await generateRecommendation(req.body);
    res.json({ recommendation });
  } catch (err) {
    console.error('Recommendation generation failed:', err.message);
    res.status(500).json({ error: 'Could not generate recommendation right now.' });
  }
});

/**
 * POST /api/ai/learning-plan
 * Body: { skillGaps: ["Python", "DSA"] }
 */
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

module.exports = router;