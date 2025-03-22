const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const db = require('firebase-admin').firestore();
const router = express.Router();


router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; 
    const userRef = db.collection('USERS').doc(userId); 
    const userDoc = await userRef.get(); 
    if (!userDoc.exists) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    
    res.json(userDoc.data());
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;
