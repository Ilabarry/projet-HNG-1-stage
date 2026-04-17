require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Stage 0 endpoint: http://localhost:${PORT}/api/classify?name=john`);
  console.log(`📡 Stage 1 endpoints:`);
  console.log(`   POST   http://localhost:${PORT}/api/profiles`);
  console.log(`   GET    http://localhost:${PORT}/api/profiles`);
  console.log(`   GET    http://localhost:${PORT}/api/profiles/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/profiles/:id`);
  console.log(`✅ CORS enabled for all origins`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});