// src/models/Ticket.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User'); // Import User model for associations

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'in-progress', 'closed'),
    allowNull: false,
    defaultValue: 'open'
  }
}, {
  tableName: 'tickets',
});

// 🔗 Associations
// User who created the ticket
User.hasMany(Ticket, { foreignKey: 'userId', as: 'createdTickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// Support agent assigned to the ticket
User.hasMany(Ticket, { foreignKey: 'agentId', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'agentId', as: 'assignedAgent' });

module.exports = Ticket;
