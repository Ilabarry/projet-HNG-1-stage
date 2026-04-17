const axios = require('axios');

const NATIONALIZE_API_URL = 'https://api.nationalize.io';

/**
 * Appelle l'API Nationalize pour obtenir la nationalité probable
 * @param {string} name - Le prénom à analyser
 * @returns {Promise<Object>} - { success, data, error }
 */
const fetchNationalityPrediction = async (name) => {
  try {
    const response = await axios.get(`${NATIONALIZE_API_URL}?name=${encodeURIComponent(name)}`, {
      timeout: 5000
    });

    const { country } = response.data;

    // Vérification des données valides
    if (!country || country.length === 0) {
      return {
        success: false,
        error: {
          statusCode: 502,
          message: 'Nationalize returned an invalid response'
        }
      };
    }

    // Prendre le pays avec la plus haute probabilité
    const topCountry = country.reduce((max, current) => {
      return current.probability > max.probability ? current : max;
    }, country[0]);

    return {
      success: true,
      data: {
        country_id: topCountry.country_id,
        country_probability: topCountry.probability
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        statusCode: 502,
        message: 'Nationalize returned an invalid response'
      }
    };
  }
};

module.exports = { fetchNationalityPrediction };