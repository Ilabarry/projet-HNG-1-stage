const db = require('../utils/db');
const { v7: uuidv7 } = require('uuid');

/**
 * Modèle Profile - Gère toutes les opérations base de données
 */
class Profile {
  /**
   * Sauvegarde un nouveau profil en base
   * @param {Object} profileData - Données du profil
   * @returns {Promise<Object>} - Profil sauvegardé avec son ID
   */
  static async save(profileData) {
    const id = uuidv7(); // Génère un UUID v7
    const now = new Date().toISOString();

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO profiles (
          id, name, gender, gender_probability, sample_size,
          age, age_group, country_id, country_probability, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        id,
        profileData.name.toLowerCase(),
        profileData.gender,
        profileData.gender_probability,
        profileData.sample_size,
        profileData.age,
        profileData.age_group,
        profileData.country_id,
        profileData.country_probability,
        now
      ];

      db.run(query, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id, ...profileData, created_at: now });
        }
      });
    });
  }

  /**
   * Trouve un profil par son nom
   * @param {string} name - Le nom à chercher
   * @returns {Promise<Object|null>} - Le profil ou null
   */
  static findByName(name) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM profiles WHERE LOWER(name) = LOWER(?)';
      db.get(query, [name], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Trouve un profil par son ID
   * @param {string} id - L'UUID du profil
   * @returns {Promise<Object|null>} - Le profil ou null
   */
  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM profiles WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Récupère tous les profils avec filtres optionnels
   * @param {Object} filters - Filtres (gender, country_id, age_group)
   * @returns {Promise<Array>} - Liste des profils
   */
  static findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT id, name, gender, age, age_group, country_id FROM profiles';
      const conditions = [];
      const params = [];

      // Construction des filtres (insensibles à la casse)
      if (filters.gender) {
        conditions.push('LOWER(gender) = LOWER(?)');
        params.push(filters.gender);
      }
      if (filters.country_id) {
        conditions.push('LOWER(country_id) = LOWER(?)');
        params.push(filters.country_id);
      }
      if (filters.age_group) {
        conditions.push('LOWER(age_group) = LOWER(?)');
        params.push(filters.age_group);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY created_at DESC';

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Supprime un profil par son ID
   * @param {string} id - L'UUID du profil
   * @returns {Promise<boolean>} - True si supprimé
   */
  static deleteById(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM profiles WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}

module.exports = Profile;