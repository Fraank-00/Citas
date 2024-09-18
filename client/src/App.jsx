import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import Reserva from './components/Reserva';
import Service from './components/Service';
import Inicio from  './components/welcomeImage'
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css'
import axios from 'axios';
import Swal from 'sweetalert2';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Para la redirección

  // Verificar si el usuario está autenticado desde el almacenamiento local
  useEffect(() => {
    const loggedUser = sessionStorage.getItem('userToken');
    if (loggedUser) {
      setUser(loggedUser); // Actualizar el estado si hay un token
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userToken');
    setUser(null); // Resetear el estado
  };

  const handleSearch = async (query) => {
    if (!query) {
      Swal.fire('Por favor, ingresa un ID para buscar');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/user/reservas`, {
        params: { id: query }
      });

      const reservas = response.data;

      if (reservas.length > 0) {
        Swal.fire({
          title: 'Reservas encontradas',
          text: `Se encontraron ${reservas.length} reservas.`,
          icon: 'info'
        });
        navigate(`/reservas/${query}`); // Redirige a una página que muestre las reservas
      } else {
        Swal.fire('No se encontraron reservas para este usuario');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al realizar la búsqueda', 'error');
    }
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} onSearch={handleSearch} />
      <Routes>
      <Route path="/" element={<Inicio />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/reservas" element={user ? <Reserva /> : <Navigate to="/login" />} />
        <Route path="/reservas/:id" element={user ? <Reserva /> : <Navigate to="/login" />} />
        <Route path="/services" element={user ? <Service /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
