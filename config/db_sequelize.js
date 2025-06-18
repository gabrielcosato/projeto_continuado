const Sequelize = require("sequelize");

const sequelize = new Sequelize("sitecursos", "postgres", "postgres", {
    host: "localhost",
    dialect: "postgres",
    logging: false 
  });


var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('../models/relational/user.js')(sequelize, Sequelize);
db.Course = require('../models/relational/course.js')(sequelize, Sequelize);
db.Lesson = require('../models/relational/lesson.js')(sequelize, Sequelize);
//Course e Lesson (1-N)
db.Course.hasMany(db.Lesson, { foreignKey: "course_id", as: "lessons" });
module.exports = db;


