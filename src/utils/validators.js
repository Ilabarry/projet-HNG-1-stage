/**
 * Valide le paramètre 'name' envoyé par l'utilisateur
 * @param {string} name - Le nom à valider
 * @returns {Object} - { isValid: boolean, error: { statusCode, message } | null }
 */
const validateNameParam = (name) => {
  // Vérifier si le paramètre existe et n'est pas vide
  if (name === undefined || name === null || name.trim() === '') {
    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: 'Missing or empty name parameter'
      }
    };
  }

  // Vérifier que c'est bien une chaîne de caractères
  if (typeof name !== 'string') {
    return {
      isValid: false,
      error: {
        statusCode: 422,
        message: 'name is not a string'
      }
    };
  }

  return { isValid: true, error: null };
};

module.exports = { validateNameParam };