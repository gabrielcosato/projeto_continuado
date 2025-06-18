const express = require("express");
const db = require('../config/db_sequelize');
const route = express.Router();
const userController = require("../controllers/userController.js");
const courseController = require("../controllers/courseController.js");
const authController = require("../controllers/authController.js");
const authenticateToken = require('../middlewares/authenticateToken');
const lessonController = require("../controllers/lessonController.js");
const controllerComentario = require('../controllers/controllerComentario');
//const evaluationController = require("../controllers/evaluationController.js");

// db.sequelize.sync({force: true}).then(() => {
//     console.log('{ force: true }');
// });


//User
route.post("/login", authController.login);
//route.get("/logout", userController.getLogout);

route.post("/users", authenticateToken, userController.postUser); 
route.put("/users/:id", authenticateToken, userController.putUser);
route.delete("/users/:id", authenticateToken, userController.deleteUser);

route.get("/users", authenticateToken, userController.getUsers); 
route.get("/users/:id", authenticateToken, userController.getUserById);


//Course

route.post("/courses", authenticateToken,  courseController.postCourse);
route.put("/courses/:id", authenticateToken, courseController.putCourse);
route.delete("/courses/:id", authenticateToken, courseController.deleteCourse);

route.get("/courses", authenticateToken, courseController.getCourses);
route.get("/courses/:id", authenticateToken, courseController.getCourseById);

//Lesson
// route.get("/cadastroLicao", lessonController.getCreate); 
// route.post("/createLesson", lessonController.createLesson);
// route.get("/lessons", lessonController.getAllLessons); 
// route.get("/lessons/:id", lessonController.getLessonById);
// route.get("/telaUpdateLesson/:id", lessonController.getUpdate);
// route.post("/lessons/update", lessonController.updateLesson);
// route.get("/lessons/delete/:id", lessonController.deleteLesson);

//Controller Comentario
// route.get("/comentarioCreate", controllerComentario.getCreate);
// route.post("/comentarioCreate", controllerComentario.postCreate);
// route.get("/comentarioList", controllerComentario.getList);

module.exports = route;
