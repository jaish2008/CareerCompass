const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

const internshipRoutes = require('./internshiproutes');
app.use('/api/internships', internshipRoutes);

const aiRoutes = require('./airoutes');
app.use('/api/ai', aiRoutes);

const { startScheduledSync } = require('./adzunaintegration');
startScheduledSync();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});