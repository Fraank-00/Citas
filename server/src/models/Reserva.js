const { DataTypes } = require('sequelize');
const { sequelize } = require('../../DB');
const User = require('./User');
const Service = require('./Service');

const Reserva = sequelize.define('Reserva', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // referencia al modelo User
      key: 'id'
    }
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service, // referencia al modelo Service
      key: 'id'
    }
  },
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'pendiente' // Puede ser 'pendiente', 'confirmada', 'cancelada'
  }
});

// Relaciones: cada reserva pertenece a un usuario y a un servicio
Reserva.belongsTo(User, { foreignKey: 'userId' });
Reserva.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = Reserva;
