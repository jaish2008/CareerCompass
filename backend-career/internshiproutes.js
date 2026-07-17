/**
 * internshipRoutes.js
 * ---------------------------------------------------------
 * Example Express routes showing how adzunaIntegration.js
 * plugs into your existing server. Mount this in your
 * main server.js with:
 *
 *   const internshipRoutes = require('./internshipRoutes');
 *   app.use('/api/internships', internshipRoutes);
 *
 * Also call startScheduledSync() once, on server startup,
 * so the Firestore cache stays fresh automatically.
 * ---------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const {
  getMatchedInternshipsForStudent,
  syncAllInternships
} = require('./adzunaintegration');

/**
 * GET /api/internships?roleType=frontend
 * Requires the logged-in student's skills — normally you'd
 * pull this from their Firestore user profile via req.user.uid
 * (from your existing auth middleware), not from the query string.
 * Shown here simplified for clarity.
 */
router.get('/', async (req, res) => {
  try {
    const { roleType, skills } = req.query;

    // In your real app: fetch studentSkills from Firestore using
    // the authenticated user's UID instead of trusting the query param.
    const studentSkills = skills ? skills.split(',') : [];

    const matches = await getMatchedInternshipsForStudent(studentSkills, roleType);
    res.json({ count: matches.length, results: matches });
  } catch (err) {
    console.error('Failed to fetch matched internships:', err);
    res.status(500).json({ error: 'Could not load internships right now.' });
  }
});

/**
 * POST /api/internships/sync
 * Manual trigger for testing — lets you refresh the Firestore
 * cache on demand instead of waiting for the 6-hour cron job.
 * In production, protect this route (admin-only) so it can't
 * be spammed and burn through your Adzuna rate limit.
 *
 * NOTE: the `detail` field in the error response is for local
 * debugging only. Remove it (or gate it behind an env check)
 * before deploying, so you don't leak internal error messages
 * to the public.
 */
router.post('/sync', async (req, res) => {
  try {
    await syncAllInternships();
    res.json({ message: 'Sync complete' });
  } catch (err) {
    console.error('SYNC ERROR:', err); // full object -> prints stack trace in Terminal 1
    res.status(500).json({
      error: 'Sync failed',
      detail: err.message // temporary — remove before production
    });
  }
});

module.exports = router;