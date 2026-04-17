const { fetchGenderPrediction } = require('./genderizeService');
const { fetchAgePrediction } = require('./agifyService');
const { fetchNationalityPrediction } = require('./nationalizeService');
const Profile = require('../models/Profile');

/**
 * Détermine le groupe d'âge à partir de l'âge
 * @param {number} age - L'âge
 * @returns {string} - child, teenager, adult, senior
 */
const determineAgeGroup = (age) => {
  if (age >= 0 && age <= 12) return 'child';
  if (age >= 13 && age <= 19) return 'teenager';
  if (age >= 20 && age <= 59) return 'adult';
  return 'senior';
};

/**
 * Appelle les 3 APIs et retourne les données combinées
 * @param {string} name - Le prénom
 * @returns {Promise<Object>} - Données combinées ou erreur
 */
const fetchAndCombineData = async (name) => {
  // Appeler les 3 APIs en parallèle pour être plus rapide
  const [genderResult, ageResult, nationalityResult] = await Promise.all([
    fetchGenderPrediction(name),
    fetchAgePrediction(name),
    fetchNationalityPrediction(name)
  ]);

  // Vérifier les erreurs
  if (!genderResult.success) {
    return { success: false, error: genderResult.error };
  }
  if (!ageResult.success) {
    return { success: false, error: ageResult.error };
  }
  if (!nationalityResult.success) {
    return { success: false, error: nationalityResult.error };
  }

  // Vérifier les cas particuliers de Genderize
  const genderData = genderResult.data;
  if (genderData.gender === null || genderData.sample_size === 0) {
    return {
      success: false,
      error: {
        statusCode: 502,
        message: 'Genderize returned an invalid response'
      }
    };
  }

  // Calculer le groupe d'âge
  const ageGroup = determineAgeGroup(ageResult.data.age);

  // Combiner toutes les données
  return {
    success: true,
    data: {
      name: name.toLowerCase(),
      gender: genderData.gender,
      gender_probability: genderData.probability,
      sample_size: genderData.sample_size,
      age: ageResult.data.age,
      age_group: ageGroup,
      country_id: nationalityResult.data.country_id,
      country_probability: nationalityResult.data.country_probability
    }
  };
};

/**
 * Crée un nouveau profil (ou retourne l'existant)
 * @param {string} name - Le prénom
 * @returns {Promise<Object>} - Le profil créé ou existant
 */
const createOrGetProfile = async (name) => {
  // Vérifier si le profil existe déjà
  const existingProfile = await Profile.findByName(name);
  
  if (existingProfile) {
    return {
      success: true,
      alreadyExists: true,
      data: existingProfile
    };
  }

  // Récupérer les données des APIs
  const combinedData = await fetchAndCombineData(name);
  
  if (!combinedData.success) {
    return combinedData;
  }

  // Sauvegarder en base
  const savedProfile = await Profile.save(combinedData.data);
  
  return {
    success: true,
    alreadyExists: false,
    data: savedProfile
  };
};

/**
 * Récupère tous les profils avec filtres
 * @param {Object} filters - Filtres (gender, country_id, age_group)
 * @returns {Promise<Object>} - Liste des profils et le count
 */
const getAllProfiles = async (filters) => {
  const profiles = await Profile.findAll(filters);
  return {
    count: profiles.length,
    data: profiles
  };
};

/**
 * Récupère un profil par son ID
 * @param {string} id - L'UUID
 * @returns {Promise<Object>} - Le profil ou erreur 404
 */
const getProfileById = async (id) => {
  const profile = await Profile.findById(id);
  if (!profile) {
    return {
      success: false,
      error: { statusCode: 404, message: 'Profile not found' }
    };
  }
  return {
    success: true,
    data: profile
  };
};

/**
 * Supprime un profil par son ID
 * @param {string} id - L'UUID
 * @returns {Promise<Object>} - Succès ou erreur
 */
const deleteProfileById = async (id) => {
  const deleted = await Profile.deleteById(id);
  if (!deleted) {
    return {
      success: false,
      error: { statusCode: 404, message: 'Profile not found' }
    };
  }
  return { success: true };
};

module.exports = {
  createOrGetProfile,
  getAllProfiles,
  getProfileById,
  deleteProfileById
};