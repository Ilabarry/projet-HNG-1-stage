const express = require('express');
const cors = require('cors');
const { classifyName } = require('./controllers/classifyController');

const app = express();

// Middleware CORS - indispensable pour que le script de notation puisse accéder à ton API
app.use(cors({
  origin: '*', // Permet à toutes les origines d'accéder
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

// Middleware pour parser le JSON (au cas où)
app.use(express.json());

// Route de base (optionnelle, pour vérifier que le serveur tourne)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HNG Backend API is running',
    endpoints: {
      classify: '/api/classify?name={name}'
    }
  });
});

// Endpoint principal demandé
app.get('/api/classify', classifyName);

// Gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Gestion globale des erreurs (fallback)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

module.exports = app;