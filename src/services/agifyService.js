const axios = require('axios');

const AGIFY_API_URL = 'https://api.agify.io';

/**
 * Appelle l'API Agify pour obtenir l'âge estimé d'un prénom
 * @param {string} name - Le prénom à analyser
 * @returns {Promise<Object>} - { success, data, error }
 */
const fetchAgePrediction = async (name) => {
  try {
    const response = await axios.get(`${AGIFY_API_URL}?name=${encodeURIComponent(name)}`, {
      timeout: 5000
    });

    const { age } = response.data;

    // Vérification des données valides
    if (age === null || age === undefined) {
      return {
        success: false,
        error: {
          statusCode: 502,
          message: 'Agify returned an invalid response'
        }
      };
    }

    return {
      success: true,
      data: {
        age: age
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        statusCode: 502,
        message: 'Agify returned an invalid response'
      }
    };
  }
};

module.exports = { fetchAgePrediction };