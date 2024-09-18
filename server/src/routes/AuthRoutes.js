const express = require('express'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 

require('dotenv').config(); 

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // Extrae los datos del cuerpo de la solicitud.

  try {
    // Validar datos de entrada
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' }); 
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el nuevo usuario
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Generar un token JWT
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // El token expira en 1 hora.
    });

    res.status(201).json({ token, user: { id: newUser.id, name, email } }); 
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' }); 
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body; 

  try {
    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' }); 
    }

    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Credenciales inválidas' }); 
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // El token expira en 1 hora.
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } }); 
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' }); 
}});

module.exports = router;