const express = require('express');
const Reserva = require('../models/Reserva');
const User = require('../models/User'); // Asegúrate de que User esté correctamente importado
const Service = require('../models/Service'); // Asegúrate de que Service esté correctamente importado
const authenticateToken = require('../auth/authent');

const router = express.Router();

// Crear una nueva reserva
router.post('/', authenticateToken, async (req, res) => {
  const { serviceId, fechaInicio, fechaFin } = req.body;
  const userId = req.user.id; // Obtén el ID del usuario desde el token JWT
  try {
    const nuevaReserva = await Reserva.create({ userId, serviceId, fechaInicio, fechaFin });
    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
});

// Obtener todas las reservas del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Obtén el ID del usuario desde el token JWT
  try {
    const reservas = await Reserva.findAll({
      where: { userId }, // Filtra reservas por el ID del usuario
      include: [User, Service] // Incluye detalles del usuario y del servicio
    });
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
});

// Ruta para actualizar una reserva
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Solo actualiza el estado para este ejemplo

  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).send('Reserva no encontrada');
    }

    if (reserva.userId !== req.user.id) {
      return res.status(403).send('No tienes permiso para actualizar esta reserva');
    }

    reserva.estado = estado;
    await reserva.save();

    res.json(reserva);
  } catch (error) {
    res.status(500).send('Error al actualizar la reserva');
  }
});

module.exports = router;
