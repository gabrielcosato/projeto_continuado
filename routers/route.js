const express = require("express");
const db = require('../config/db_sequelize');
const route = express.Router();
const userController = require("../controllers/userController.js");
const courseController = require("../controllers/courseController.js");
const authController = require("../controllers/authController.js");
const authenticateToken = require('../middlewares/authenticateToken');
const lessonController = require("../controllers/lessonController.js");
const controllerComentario = require('../controllers/controllerComentario');
const enrollmentController = require("../controllers/enrollmentController.js");
const evaluationController = require("../controllers/evaluationController.js");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


//const evaluationController = require("../controllers/evaluationController.js");

// db.sequelize.sync({force: true}).then(() => {
//     console.log('{ force: true }');
// });


//User
route.post("/login", authController.login);
//route.get("/logout", userController.getLogout);

route.post("/users", userController.postUser); 
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

route.post("/lessons", upload.single("pdf"), authenticateToken,  lessonController.postLesson);
route.put("/lessons/:id", upload.single("pdf"), authenticateToken, lessonController.putLesson);
route.delete("/lessons/:id", authenticateToken, lessonController.deleteLesson);

route.get("/lessons", authenticateToken, lessonController.getLessons);
route.get("/lessons/:id", authenticateToken, lessonController.getLessonById);

// Enrollment
route.post("/enrollments", authenticateToken, enrollmentController.postEnrollment);
route.put("/enrollments/:id", authenticateToken, enrollmentController.putEnrollment);
route.delete("/enrollments/:id", authenticateToken, enrollmentController.deleteEnrollment);

route.get("/enrollments", authenticateToken, enrollmentController.getEnrollments);
route.get("/enrollments/:id", authenticateToken, enrollmentController.getEnrollmentById);

// Evaluation
route.post("/evaluations", authenticateToken, evaluationController.postEvaluation);
route.put("/evaluations/:id", authenticateToken, evaluationController.putEvaluation);
route.delete("/evaluations/:id", authenticateToken, evaluationController.deleteEvaluation);

route.get("/evaluations", authenticateToken, evaluationController.getEvaluations);
route.get("/evaluations/:id", authenticateToken, evaluationController.getEvaluationById);


//Controller Comentario
// route.get("/comentarioCreate", controllerComentario.getCreate);
// route.post("/comentarioCreate", controllerComentario.postCreate);
// route.get("/comentarioList", controllerComentario.getList);

module.exports = route;
