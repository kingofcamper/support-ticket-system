const User = require("./User");
const Ticket = require("./Ticket");

const models = { User, Ticket };

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
