import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Table, Spinner, Dropdown } from 'react-bootstrap';

const API_URL = 'http://localhost:3000/reservas'; // Cambia esta URL según sea necesario

const Reserva = () => {
  const [reservas, setReservas] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    serviceId: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'pendiente'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
    if (token) {
      fetchData(token);
    } else {
      Swal.fire('Error', 'No tienes permiso para acceder. Inicia sesión.', 'error')
        .then(() => {
          navigate('/login');
        });
    }
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      await Promise.all([fetchReservas(token), fetchServices(token)]);
    } catch (error) {
      setError('No se pudo obtener la información. Verifica tu acceso.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReservas = async (token) => {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReservas(response.data);
  };

  const fetchServices = async (token) => {
    const response = await axios.get('http://localhost:3000/services', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setServices(response.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('userToken');
    if (!token) {
      Swal.fire('Error', 'No tienes permiso para realizar esta acción.', 'error');
      navigate('/login');
      return;
    }
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editingReserva}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Éxito', 'Reserva actualizada exitosamente', 'success');
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Éxito', 'Reserva creada exitosamente', 'success');
      }
      fetchReservas(token);
      resetForm();
    } catch (error) {
      Swal.fire('Error', 'No se pudo realizar la acción.', 'error');
    }
  };

  const handleEdit = (reserva) => {
    setIsEditing(true);
    setEditingReserva(reserva.id);
    setFormData({
      userId: reserva.userId,
      serviceId: reserva.serviceId,
      fechaInicio: reserva.fechaInicio,
      fechaFin: reserva.fechaFin,
      estado: reserva.estado,
    });
  };

  const handleDelete = async (id) => {
    const token = sessionStorage.getItem('userToken');
    if (!token) {
      Swal.fire('Error', 'No tienes permiso para eliminar reservas.', 'error')
        .then(() => navigate('/login'));
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
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire('Eliminado', 'La reserva ha sido eliminada.', 'success');
          fetchReservas(token);
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar la reserva.', 'error');
        }
      }
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = sessionStorage.getItem('userToken');
    if (!token) {
      Swal.fire('Error', 'No tienes permiso para actualizar el estado.', 'error')
        .then(() => navigate('/login'));
      return;
    }

    try {
      await axios.put(`${API_URL}/${id}`, { estado: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire('Éxito', `Estado actualizado a ${newStatus}`, 'success');
      fetchReservas(token);
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      serviceId: '',
      fechaInicio: '',
      fechaFin: '',
      estado: 'pendiente',
    });
    setIsEditing(false);
    setEditingReserva(null);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h1>Gestión de Reservas</h1>
      {error && <p className="text-danger">{error}</p>}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="formUserId">
          <Form.Label>ID Usuario</Form.Label>
          <Form.Control
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formServiceId">
          <Form.Label>ID Servicio</Form.Label>
          <Form.Control
            as="select"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Servicio</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formFechaInicio">
          <Form.Label>Fecha Inicio</Form.Label>
          <Form.Control
            type="datetime-local"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formFechaFin">
          <Form.Label>Fecha Fin</Form.Label>
          <Form.Control
            type="datetime-local"
            name="fechaFin"
            value={formData.fechaFin}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEstado">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            as="select"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          {isEditing ? 'Actualizar Reserva' : 'Crear Reserva'}
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Usuario</th>
            <th>ID Servicio</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(reserva => (
            <tr key={reserva.id}>
              <td>{reserva.id}</td>
              <td>{reserva.userId}</td>
              <td>{reserva.serviceId}</td>
              <td>{new Date(reserva.fechaInicio).toLocaleString()}</td>
              <td>{new Date(reserva.fechaFin).toLocaleString()}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="info" id={`estado-${reserva.id}`}>
                    {reserva.estado}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleStatusChange(reserva.id, 'pendiente')}>Pendiente</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusChange(reserva.id, 'confirmada')}>Confirmada</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusChange(reserva.id, 'cancelada')}>Cancelada</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Reserva;
