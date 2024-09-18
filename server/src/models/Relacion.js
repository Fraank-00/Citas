const User = require('./User');
const Service = require('./Service');
const Reserva = require('./Reserva');

// Relaciones
User.hasMany(Reserva, { foreignKey: 'userId' });
Service.hasMany(Reserva, { foreignKey: 'serviceId' });

module.exports = { User, Service, Reserva };
