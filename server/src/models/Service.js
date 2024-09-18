const { DataTypes } = require('sequelize');
const { sequelize } = require('../../DB'); 
const User = require('./User'); // Asegúrate de importar el modelo User

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  
}, {
  tableName: 'services' // Nombre de la tabla en la base de datos
});

// Establecer relación entre Service y User
Service.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Service, { foreignKey: 'userId' });

module.exports = Service;
