const Service = require('../models/Service');

// Obtener todos los servicios
const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    console.error('Error al obtener los servicios:', error); // Agregar más detalle en el log
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

// Crear un nuevo servicio
const createService = async (req, res) => {
  const { name, description, price, userId } = req.body; // Asegúrate de incluir userId si es necesario
  try {
    const newService = await Service.create({ name, description, price, userId });
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error al crear el servicio:', error); // Agregar más detalle en el log
    res.status(500).json({ error: 'Error al crear el servicio' });
  }
};

// Obtener un servicio por ID
const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error('Error al obtener el servicio:', error); // Agregar más detalle en el log
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
};

// Actualizar un servicio
const updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    service.name = name;
    service.description = description;
    service.price = price;
    await service.save();
    res.status(200).json(service);
  } catch (error) {
    console.error('Error al actualizar el servicio:', error); // Agregar más detalle en el log
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
};

// Eliminar un servicio
const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    await service.destroy();
    res.status(204).json({ message: 'Servicio eliminado' });
  } catch (error) {
    console.error('Error al eliminar el servicio:', error); // Agregar más detalle en el log
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
};

module.exports = {
  getAllServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
};
