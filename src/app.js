const express = require('express');
const cors = require('cors');
const { classifyName } = require('./controllers/classifyController');
const profileController = require('./controllers/profileController');

const app = express();

// Middleware CORS - indispensable pour le script de notation
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Middleware pour parser le JSON
app.use(express.json());

// Route de base (vérification que le serveur tourne)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HNG Backend API is running',
    endpoints: {
      stage0: '/api/classify?name={name}',
      stage1: {
        create: 'POST /api/profiles',
        getOne: 'GET /api/profiles/{id}',
        getAll: 'GET /api/profiles?gender=&country_id=&age_group=',
        delete: 'DELETE /api/profiles/{id}'
      }
    }
  });
});

// Stage 0 - Endpoint existant
app.get('/api/classify', classifyName);

// Stage 1 - Nouveaux endpoints
app.post('/api/profiles', profileController.createProfile);
app.get('/api/profiles', profileController.getAllProfiles);
app.get('/api/profiles/:id', profileController.getProfileById);
app.delete('/api/profiles/:id', profileController.deleteProfile);

// Gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

module.exports = app;