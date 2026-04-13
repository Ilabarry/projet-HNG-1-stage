require('dotenv').config(); // Charge les variables d'environnement
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/classify?name=john`);
  console.log(`✅ CORS enabled for all origins`);
});