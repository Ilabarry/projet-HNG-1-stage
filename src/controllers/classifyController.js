const { validateNameParam } = require('../utils/validators');
const { fetchGenderPrediction } = require('../services/genderizeService');

/**
 * Traite la réponse brute de Genderize et la transforme selon les règles
 * @param {Object} rawData - Données brutes de Genderize
 * @param {string} originalName - Le nom original
 * @returns {Object} - Données formatées
 */
const processGenderizeResponse = (rawData, originalName) => {
  const { gender, probability, count } = rawData;
  
  // Cas où aucune prédiction n'est disponible
  if (gender === null || count === 0) {
    return {
      error: true,
      message: 'No prediction available for the provided name'
    };
  }

  // Renommer count en sample_size
  const sampleSize = count;
  
  // Calculer is_confident : true si probability >= 0.7 ET sampleSize >= 100
  const isConfident = (probability >= 0.7 && sampleSize >= 100);
  
  // Générer la date UTC au format ISO 8601
  const processedAt = new Date().toISOString();

  return {
    error: false,
    data: {
      name: originalName,
      gender: gender,
      probability: probability,
      sample_size: sampleSize,
      is_confident: isConfident,
      processed_at: processedAt
    }
  };
};

/**
 * Contrôleur principal pour l'endpoint /api/classify
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
const classifyName = async (req, res) => {
  const { name } = req.query;

  // 1. Valider le paramètre name
  const validation = validateNameParam(name);
  if (!validation.isValid) {
    return res.status(validation.error.statusCode).json({
      status: 'error',
      message: validation.error.message
    });
  }

  // 2. Appeler l'API Genderize
  const genderizeResult = await fetchGenderPrediction(name);
  if (!genderizeResult.success) {
    return res.status(genderizeResult.error.statusCode).json({
      status: 'error',
      message: genderizeResult.error.message
    });
  }

  // 3. Traiter la réponse
  const processedResult = processGenderizeResponse(genderizeResult.data, name);
  
  // 4. Si Genderize n'a pas pu prédire (gender null ou count 0)
  if (processedResult.error) {
    return res.status(200).json({
      status: 'error',
      message: processedResult.message
    });
  }

  // 5. Succès - retourner la réponse formatée
  return res.status(200).json({
    status: 'success',
    data: processedResult.data
  });
};

module.exports = { classifyName };