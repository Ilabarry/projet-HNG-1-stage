const axios = require('axios');

module.exports = async (req, res) => {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { name } = req.query;

  // Validation
  if (!name || name.trim() === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Missing or empty name parameter'
    });
  }

  if (typeof name !== 'string') {
    return res.status(422).json({
      status: 'error',
      message: 'name is not a string'
    });
  }

  try {
    // Appel à Genderize
    const response = await axios.get(`https://api.genderize.io/?name=${encodeURIComponent(name)}`);
    const { gender, probability, count } = response.data;

    // Cas particulier
    if (gender === null || count === 0) {
      return res.status(200).json({
        status: 'error',
        message: 'No prediction available for the provided name'
      });
    }

    // Traitement
    const isConfident = (probability >= 0.7 && count >= 100);
    
    res.status(200).json({
      status: 'success',
      data: {
        name: name,
        gender: gender,
        probability: probability,
        sample_size: count,
        is_confident: isConfident,
        processed_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'External API error'
    });
  }
};