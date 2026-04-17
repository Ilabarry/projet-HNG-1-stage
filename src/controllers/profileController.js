const profileService = require('../services/profileService');

/**
 * Valide le paramètre name pour la création de profil
 */
const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, statusCode: 400, message: 'Missing or empty name' };
  }
  if (typeof name !== 'string') {
    return { valid: false, statusCode: 422, message: 'Invalid type' };
  }
  return { valid: true };
};

/**
 * POST /api/profiles
 * Crée un nouveau profil
 */
const createProfile = async (req, res) => {
  const { name } = req.body;

  // Validation
  const validation = validateName(name);
  if (!validation.valid) {
    return res.status(validation.statusCode).json({
      status: 'error',
      message: validation.message
    });
  }

  // Créer ou récupérer le profil
  const result = await profileService.createOrGetProfile(name);

  if (!result.success) {
    return res.status(result.error.statusCode).json({
      status: 'error',
      message: result.error.message
    });
  }

  // Si le profil existait déjà
  if (result.alreadyExists) {
    return res.status(200).json({
      status: 'success',
      message: 'Profile already exists',
      data: result.data
    });
  }

  // Nouveau profil créé
  return res.status(201).json({
    status: 'success',
    data: result.data
  });
};

/**
 * GET /api/profiles/:id
 * Récupère un profil par son ID
 */
const getProfileById = async (req, res) => {
  const { id } = req.params;

  const result = await profileService.getProfileById(id);

  if (!result.success) {
    return res.status(result.error.statusCode).json({
      status: 'error',
      message: result.error.message
    });
  }

  return res.status(200).json({
    status: 'success',
    data: result.data
  });
};

/**
 * GET /api/profiles
 * Récupère tous les profils avec filtres optionnels
 */
const getAllProfiles = async (req, res) => {
  const { gender, country_id, age_group } = req.query;

  const filters = {};
  if (gender) filters.gender = gender;
  if (country_id) filters.country_id = country_id;
  if (age_group) filters.age_group = age_group;

  const result = await profileService.getAllProfiles(filters);

  return res.status(200).json({
    status: 'success',
    count: result.count,
    data: result.data
  });
};

/**
 * DELETE /api/profiles/:id
 * Supprime un profil
 */
const deleteProfile = async (req, res) => {
  const { id } = req.params;

  const result = await profileService.deleteProfileById(id);

  if (!result.success) {
    return res.status(result.error.statusCode).json({
      status: 'error',
      message: result.error.message
    });
  }

  return res.status(204).send();
};

module.exports = {
  createProfile,
  getProfileById,
  getAllProfiles,
  deleteProfile
};