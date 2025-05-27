const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("open", "in-progress", "closed"),
      allowNull: false,
      defaultValue: "open",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "urgent"),
      allowNull: false,
      defaultValue: "low",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    agentId: {
      // New field to store the assigned agent's ID
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null until assigned
      references: {
        model: "users", // Refers to the 'users' table
        key: "id", // 'id' field of the 'users' table
      },
    },
  },
  {
    tableName: "tickets",
  }
);

// Correct association (WITHOUT requiring User directly)
Ticket.associate = (models) => {
  Ticket.belongsTo(models.User, { as: "creator", foreignKey: "userId" });
  Ticket.belongsTo(models.User, { as: "assignedAgent", foreignKey: "agentId" });
};

module.exports = Ticket;
