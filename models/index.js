"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "..", "config", "config.json"))[env];



const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const relationalPath = path.join(__dirname, 'relational');

fs.readdirSync(relationalPath)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(relationalPath, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});




/*Course e Lesson (1-N)
db.course.hasMany(db.lesson, { foreignKey: "course_id", as: "lessons" });
d*/
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
