import { Form, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      Swal.fire('El campo de nombre no puede estar vacío');
      return;
    }

    if (!regexEmail.test(email)) {
      Swal.fire('Email no válido');
      return;
    }

    if (password.length < 6) {
      Swal.fire('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', formData);
      Swal.fire('Registro exitoso', 'Ahora puedes iniciar sesión', 'success').then(() => {
        navigate('/login'); // Redirige al login
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Error al registrarse', 'error');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="form-container">
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Registrarse
      </Button>
    </Form>
  );
};

export default Register;