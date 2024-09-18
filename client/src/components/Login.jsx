import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false); // Nuevo estado para manejar la carga

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
      Swal.fire('Email no válido');
      return;
    }

    if (password.length < 6) {
      Swal.fire('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true); // Mostrar el spinner

    try {
      const response = await axios.post('http://localhost:3000/auth/login', formData);
      sessionStorage.setItem('userToken', response.data.token);
      setUser(response.data.token); // Establece el token en el estado
      Swal.fire('Inicio de sesión exitoso', '', 'success').then(() => {
        navigate('/'); // Redirige a la página principal
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false); // Ocultar el spinner
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="form-container">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
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
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Login'}
      </Button>
    </Form>
  );
};

export default Login;
