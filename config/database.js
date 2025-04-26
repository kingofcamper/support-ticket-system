const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,         // Database name
  process.env.DB_USER,         // Username
  process.env.DB_PASSWORD,     // Password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Disable SQL query logs; set to console.log if you want to debug
    define: {
      timestamps: true, // Automatically add createdAt/updatedAt
    },
    pool: {
      max: 5,       // Connection pool settings
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Function to test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
