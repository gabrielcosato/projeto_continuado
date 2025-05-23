const db = require("../config/db_sequelize");
const { lesson: Lesson, course: Course } = db;

module.exports = {

     async getCreate(req, res) {
        const courses = await Course.findAll({
                attributes: ["id", "title"]
            });
        res.render("lesson/lessonCreate", {
                courses: courses.map(course => course.toJSON())
        });; 
    },
    
    async createLesson(req, res) {
        try {
            const { title, course_id, duration_min, position } = req.body;

            
            const course = await Course.findByPk(course_id);
            if (!course) {
                console.log("nao achou um curso para associar a licao");
                return res.status(404).send("Course not found. Cannot add lesson to a non-existent course.");
            }

            const newLesson = await Lesson.create({
                title,
                course_id,
                duration_min,
                position
            });
            console.log("licao criada com sucesso!");
            res.redirect("/home");
        } catch (err) {
            console.error("Error creating lesson:", err);
        }
    },

    async getAllLessons(req, res) {
        try {
        
            const lessons = await Lesson.findAll({
                attributes: ["id", "title", "course_id","duration_min", "position"]
            });
             res.render("lesson/lessonList", { lessons: lessons.map( lesson => lesson.toJSON()) });
        } catch (err) {
            console.error("Error fetching lessons:", err);
        }
    },

    async getLessonById(req, res) {
        try {
            const lessonId = req.params.id;
            const lesson = await Lesson.findByPk(lessonId, {
                attributes: ["title" , "course_id" , "duration_min", "position"]
            });
            if (lesson) {
                console.log("achou a licao");
            } else {
                console.log("não achou a licao!");
            }
        } catch (err) {
            console.error("Error fetching lesson by ID:", err);
        }
    },

    async getUpdate(req, res) {
            const { title, course_id, duration_min, position } = req.body;

            const courses = await Course.findAll({
                attributes: ["id", "title"]
            });

            const lesson = await Lesson.findByPk(req.params.id).then(
                lesson => res.render('lesson/lessonUpdate',
                    {
                        lesson: lesson.dataValues,
                        courses: courses.map(course => course.toJSON())
                    })
            ).catch(function (err) {
                console.log(err);
            });
        },

    async updateLesson(req, res) {
        try {
            
            const {id, title, course_id, duration_min, position } = req.body;

            const lesson = await Lesson.findByPk(id);
            if (!lesson) {
                console.log("não achou a licao!");
            }

            lesson.title = title || lesson.title;
            lesson.duration_min = duration_min || lesson.duration_min;
            lesson.position = position || lesson.position;
            lesson.course_id = course_id || lesson.course_id;

            await lesson.save();
            console.log("EDITOU A LICAO!");
            
            res.redirect('/home');
        } catch (err) {
            console.error("Error updating lesson:", err);
        }
    },

    async deleteLesson(req, res) {
        try {
            const lessonId = req.params.id;
            const lesson = await Lesson.findByPk(lessonId);

            if (!lesson) {
                console.log("não achou a licao!");
            }

            await lesson.destroy();
            console.log("deletou a licao.");
            res.render('home')
        } catch (err) {
            console.error("Error deleting lesson:", err);
        }
    }
};
