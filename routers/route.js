const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController.js");
const courseController = require("../controllers/courseController.js");
//const enrollmentController = require("../controllers/enrollmentController.js");
const lessonController = require("../controllers/lessonController.js");
const controllerComentario = require('../controllers/controllerComentario');
//const evaluationController = require("../controllers/evaluationController.js");


route.get("/home", function (req, res) {
    //if (req.cookies.userData)  alooo{
    if (req.session.login) {
        res.render('home')
    }
    else
        res.redirect('/'); 
});

//User
route.get("/", userController.getLogin); 
route.post("/login", userController.postLogin);
route.get("/logout", userController.getLogout);
route.get("/cadastro", userController.getCreate); 
route.post("/cadastro2", userController.postCreate); 
route.get("/users", userController.getUserList); 
route.get("/users/:id", userController.getUserById);
route.get("/telaUpdateUser/:id", userController.getUpdate);
route.post("/users/update", userController.updateUser);
route.get("/users/delete/:id", userController.deleteUser);

//Course
route.get("/cadastroCurso", courseController.getCreate); 
route.post("/createCourse", courseController.createCourse);
route.get("/courses", courseController.getAllCourses);
route.get("/courses/:id", courseController.getCourseById);
route.get("/telaUpdateCourse/:id", courseController.getUpdate);
route.post("/courses/update", courseController.updateCourse);
route.get("/courses/delete/:id", courseController.deleteCourse);


//Lesson
route.get("/cadastroLicao", lessonController.getCreate); 
route.post("/createLesson", lessonController.createLesson);
route.get("/lessons", lessonController.getAllLessons); 
route.get("/lessons/:id", lessonController.getLessonById);
route.get("/telaUpdateLesson/:id", lessonController.getUpdate);
route.post("/lessons/update", lessonController.updateLesson);
route.get("/lessons/delete/:id", lessonController.deleteLesson);

//Controller Comentario
route.get("/comentarioCreate", controllerComentario.getCreate);
route.post("/comentarioCreate", controllerComentario.postCreate);
route.get("/comentarioList", controllerComentario.getList);

module.exports = route;
