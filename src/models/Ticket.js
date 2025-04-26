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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tickets",
  }
);

// Correct association (WITHOUT requiring User directly)
Ticket.associate = (models) => {
  Ticket.belongsTo(models.User, { as: "creator", foreignKey: "userId" });
};

module.exports = Ticket;
