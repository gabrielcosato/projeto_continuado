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
db.Enrollment = require('../models/relational/enrollment.js')(sequelize, Sequelize);
db.Evaluation = require('../models/relational/evaluation.js')(sequelize, Sequelize);
//Course e Lesson (1-N)

db.Course.hasMany(db.Lesson, { foreignKey: "course_id", as: "lessons" });

// Enrollment pertence a um Course
db.Enrollment.belongsTo(db.Course, { foreignKey: "course_id", as: "course" });

// Enrollment pertence a um User
db.Enrollment.belongsTo(db.User, { foreignKey: "user_id", as: "user" });

// User pode ter várias enrollments
db.User.hasMany(db.Enrollment, { foreignKey: "user_id", as: "enrollments" });

// Course pode ter várias enrollments
db.Course.hasMany(db.Enrollment, { foreignKey: "course_id", as: "enrollments" });

// Lesson pertence a um Course
db.Lesson.belongsTo(db.Course, { foreignKey: "course_id", as: "course" });

db.Evaluation.belongsTo(db.Course, { foreignKey: 'course_id', as: 'course' });
db.Course.hasOne(db.Evaluation, { foreignKey: 'course_id', as: 'evaluation' });



module.exports = db;


