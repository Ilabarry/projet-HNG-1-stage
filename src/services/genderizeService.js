const axios = require('axios');

/**
 * Appelle l'API Genderize pour obtenir une prédiction de genre
 * @param {string} name - Le prénom à analyser
 * @returns {Promise<Object>} - La réponse de l'API ou une erreur
 */
const fetchGenderPrediction = async (name) => {
  try {
    const apiUrl = process.env.GENDERIZE_API_URL;
    const response = await axios.get(`${apiUrl}?name=${encodeURIComponent(name)}`, {
      timeout: 5000 // 5 secondes max d'attente
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    // Gérer les différents types d'erreurs réseau
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return {
        success: false,
        error: {
          statusCode: 504,
          message: 'External API timeout'
        }
      };
    }
    
    if (error.response) {
      // L'API a répondu avec une erreur HTTP
      return {
        success: false,
        error: {
          statusCode: 502,
          message: 'External API returned an error'
        }
      };
    }

    // Autres erreurs (réseau, DNS, etc.)
    return {
      success: false,
      error: {
        statusCode: 500,
        message: 'Internal server error while calling external API'
      }
    };
  }
};

module.exports = { fetchGenderPrediction };