const Sequelize = require("sequelize");

const sequelize = new Sequelize("sitecursos", "postgres", "postgres", {
    host: "localhost",
    dialect: "postgres",
    logging: false 
  });

const db = {};


const models = require("../models");


Object.keys(models).forEach(modelName => {
  if (modelName !== 'sequelize' && modelName !== 'Sequelize') {
    db[modelName] = models[modelName];
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;

