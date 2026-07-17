const { syncAllInternships } = require('./adzunaintegration');

syncAllInternships()
  .then(() => {
    console.log('✅ Sync succeeded');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  });