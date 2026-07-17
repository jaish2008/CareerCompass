/**
 * adzunaIntegration.js
 * ---------------------------------------------------------
 * Fetches real internship/job listings from the Adzuna API,
 * extracts skills from each listing's description, scores
 * them against a student's skill profile, and caches the
 * results in Firestore so the frontend never calls Adzuna
 * directly (protects your rate limit + keeps the app fast).
 *
 * Fits into your existing stack: Node.js + Express + Firebase.
 *
 * Setup:
 *   npm install axios node-cron firebase-admin dotenv
 *
 * .env file (never commit this):
 *   ADZUNA_APP_ID=your_app_id
 *   ADZUNA_APP_KEY=your_app_key
 * ---------------------------------------------------------
 */

require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const admin = require('firebase-admin');

// Assumes firebase-admin is already initialized elsewhere in your project
// (e.g. admin.initializeApp() in your main server.js). If not, uncomment:
// admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs/in/search/1';

// ---------------------------------------------------------
// 1. Role categories to search for — matches your 8 tabs
// ---------------------------------------------------------
const ROLE_SEARCH_TERMS = {
  software: 'software developer intern',
  frontend: 'frontend developer intern',
  backend: 'backend developer intern',
  fullstack: 'full stack developer intern',
  datascience: 'data scientist intern',
  aiml: 'machine learning intern',
  cybersecurity: 'cyber security intern',
  cloud: 'cloud engineer intern'
};

// ---------------------------------------------------------
// 2. Skill dictionary used for keyword-based extraction
//    from Adzuna's plain-text job descriptions
// ---------------------------------------------------------
const SKILL_DICTIONARY = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue',
  'Node.js', 'Express', 'MongoDB', 'Firebase', 'SQL', 'MySQL', 'PostgreSQL',
  'Python', 'Java', 'C++', 'Git', 'GitHub', 'REST API', 'GraphQL',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux', 'CI/CD',
  'Statistics', 'Pandas', 'NumPy', 'Machine Learning', 'TensorFlow', 'PyTorch',
  'Networking', 'Cyber Security', 'Ethical Hacking', 'DSA'
];

/**
 * Extracts known skills from a block of free text (job description
 * or resume text) using simple case-insensitive keyword matching.
 * Intentionally simple and explainable — no black-box NLP model.
 */
function extractSkillsFromText(text) {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  return SKILL_DICTIONARY.filter(skill =>
    lowerText.includes(skill.toLowerCase())
  );
}

// ---------------------------------------------------------
// 3. Fetch listings from Adzuna for a single role category
// ---------------------------------------------------------
async function fetchListingsForRole(roleType, searchTerm) {
  try {
    const response = await axios.get(ADZUNA_BASE_URL, {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        what: searchTerm,
        where: 'india',
        results_per_page: 20,
        max_days_old: 30
      }
    });

    return response.data.results.map(job => ({
      id: job.id,
      roleType,
      title: job.title,
      company: job.company?.display_name || 'Company not listed',
      location: job.location?.display_name || 'India',
      description: job.description,
      skills: extractSkillsFromText(job.description),
      salaryMin: job.salary_min || null,
      salaryMax: job.salary_max || null,
      applyUrl: job.redirect_url,
      postedDate: job.created,
      source: 'adzuna',
      fetchedAt: admin.firestore.FieldValue.serverTimestamp()
    }));
  } catch (err) {
    console.error(`Adzuna fetch failed for role "${roleType}":`, err.message);
    return []; // fail gracefully — don't break the whole sync for one role
  }
}

// ---------------------------------------------------------
// 4. Fetch all role categories and write to Firestore
// ---------------------------------------------------------
async function syncAllInternships() {
  console.log('[Adzuna Sync] Starting scheduled sync...');
  const batch = db.batch();
  let totalFetched = 0;

  for (const [roleType, searchTerm] of Object.entries(ROLE_SEARCH_TERMS)) {
    const listings = await fetchListingsForRole(roleType, searchTerm);

    listings.forEach(listing => {
      const docRef = db.collection('liveInternships').doc(`${roleType}_${listing.id}`);
      batch.set(docRef, listing, { merge: true });
      totalFetched++;
    });

    // Small delay between role calls to stay well within rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await batch.commit();
  console.log(`[Adzuna Sync] Done. ${totalFetched} listings synced to Firestore.`);
  return totalFetched;
}

// ---------------------------------------------------------
// 5. Match score: student skill profile vs a listing's skills
//    Simple weighted overlap — same logic used for the
//    Internship Tracker's dummy data, now driven by real listings.
// ---------------------------------------------------------
function calculateMatchScore(studentSkills, listingSkills) {
  if (!listingSkills.length) return 0;

  const studentSet = new Set(studentSkills.map(s => s.toLowerCase()));
  const matched = listingSkills.filter(skill => studentSet.has(skill.toLowerCase()));

  const score = (matched.length / listingSkills.length) * 100;
  return Math.round(score);
}

/**
 * Returns Firestore-stored listings scored against one student's
 * skill profile, sorted by best match first. Call this from your
 * Express route when a student opens the Internship Tracker page.
 */
async function getMatchedInternshipsForStudent(studentSkills, roleType = null) {
  let query = db.collection('liveInternships');
  if (roleType && roleType !== 'all') {
    query = query.where('roleType', '==', roleType);
  }

  const snapshot = await query.get();
  const results = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      matchScore: calculateMatchScore(studentSkills, data.skills)
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

// ---------------------------------------------------------
// 6. Schedule the sync — runs every 6 hours
//    (keeps you well within Adzuna's free-tier rate limit)
// ---------------------------------------------------------
function startScheduledSync() {
  cron.schedule('0 */6 * * *', () => {
    syncAllInternships().catch(err =>
      console.error('[Adzuna Sync] Scheduled sync failed:', err)
    );
  });
  console.log('[Adzuna Sync] Scheduled job registered — runs every 6 hours.');
}

module.exports = {
  syncAllInternships,
  getMatchedInternshipsForStudent,
  extractSkillsFromText,
  calculateMatchScore,
  startScheduledSync
};