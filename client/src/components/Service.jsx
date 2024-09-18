import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Table, Modal, Alert, Spinner } from 'react-bootstrap';

const API_URL = 'http://localhost:3000/services'; // Cambia esta URL según sea necesario

const Service = () => {
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Para redirigir al usuario

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
    if (token) {
      fetchServices(token);
    } else {
      Swal.fire('Error', 'No tienes permiso para acceder. Inicia sesión.', 'error')
        .then(() => {
          navigate('/login');
        });
    }
  }, [navigate]);

  // Obtener todos los servicios
  const fetchServices = async (token) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(response.data);
    } catch (error) {
      setError('No se pudo obtener los servicios. Verifica tu acceso.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Crear un nuevo servicio
  const handleCreate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('userToken');
    if (!token) {
      Swal.fire('Error', 'No tienes permiso para crear servicios.', 'error')
        .then(() => {
          navigate('/login');
        });
      return;
    }

    try {
      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire('Éxito', 'Servicio creado exitosamente', 'success');
      fetchServices(token);
      resetForm();
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el servicio', 'error');
    }
  };

  // Preparar el formulario para la edición de un servicio
  const handleEdit = (service) => {
    setIsEditing(true);
    setEditingService(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
    });
  };

  // Actualizar un servicio
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('userToken');
    if (!token) {
      Swal.fire('Error', 'No tienes permiso para actualizar servicios.', 'error')
        .then(() => {
          navigate('/login');
        });
      return;
    }

    try {
      await axios.put(`${API_URL}/${editingService}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire('Éxito', 'Servicio actualizado exitosamente', 'success');
      fetchServices(token);
      resetForm();
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el servicio', 'error');
    }
  };

  // Eliminar un servicio
  const handleDelete = async (id) => {
    const token = sessionStorage.getItem('userToken');
    if (!token) {
      Swal.fire('Error', 'No tienes permiso para eliminar servicios.', 'error')
        .then(() => {
          navigate('/login');
        });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire('Eliminado', 'El servicio ha sido eliminado.', 'success');
          fetchServices(token);
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar el servicio.', 'error');
        }
      }
    });
  };

  // Reiniciar formulario
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
    });
    setIsEditing(false);
    setEditingService(null);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h1>Gestión de Servicios</h1>

      {/* Formulario para crear/editar */}
      <Form onSubmit={isEditing ? handleUpdate : handleCreate} className="mb-4">
        <Form.Group controlId="formName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPrice">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {isEditing ? 'Actualizar Servicio' : 'Crear Servicio'}
        </Button>
      </Form>

      {/* Tabla para listar servicios */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>{service.price}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(service)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(service.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Service;
