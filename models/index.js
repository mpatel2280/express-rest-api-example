const { Sequelize, DataTypes } = require('sequelize');

// Create a new Sequelize instance with MySQL credentials
const sequelize = new Sequelize('express_rest_api_example', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Define a User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync the database
sequelize.sync()
  .then(() => console.log('Database synchronized...'))
  .catch(err => console.log('Error: ' + err));

module.exports = { sequelize, User };
