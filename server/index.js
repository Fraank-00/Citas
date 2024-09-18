const express = require('express');
const cors = require('cors');
const { sequelize } = require('./DB');
const User = require('./src/models/User');
const Service = require('./src/models/Service');
const Reserva = require('./src/models/Reserva');

const authRoutes = require('./src/routes/AuthRoutes');
const reservaRoutes = require('./src/routes/ReservasRouter');
const serviceRoutes = require('./src/routes/serviceRoutes');

const authenticateToken = require('./src/auth/authent');

require('dotenv').config()

const app = express();

// Middleware para manejar JSON
app.use(express.json());
app.use(cors());

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send("ejemplo");
});

// Usar las rutas de autenticación
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/reservas', reservaRoutes); // Rutas de reservas
app.use('/services', serviceRoutes); // Rutas de servicios


// Sincronización de modelos y inicio del servidor
sequelize.sync({ force: false }) // Sincroniza los modelos de Sequelize con la base de datos.
  .then(() => {
    console.log('Tablas sincronizadas');
    app.listen(3000, () => {
      console.log('El servidor está corriendo en el puerto 3000');
    });
  })
  .catch(err => console.error('Error al sincronizar modelos:', err));
