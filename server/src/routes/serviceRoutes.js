const express = require('express');
const {
  getAllServices,
  createService,
  getServiceById,
  updateService,
  deleteService
} = require('../controller/ServiceController');
const authenticateToken = require('../auth/authent'); // Asegúrate de importar el middleware

const router = express.Router();

// Ruta para obtener todos los servicios - protegida por autenticación
router.get('/', authenticateToken, getAllServices);

// Ruta para crear un nuevo servicio - protegida por autenticación
router.post('/', authenticateToken, createService);

// Ruta para obtener un servicio por ID - protegida por autenticación
router.get('/:id', authenticateToken, getServiceById);

// Ruta para actualizar un servicio - protegida por autenticación
router.put('/:id', authenticateToken, updateService);

// Ruta para eliminar un servicio - protegida por autenticación
router.delete('/:id', authenticateToken, deleteService);

module.exports = router;
