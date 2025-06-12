const db = require("../config/db_sequelize");
const { course: Course, user: User, lesson: Lesson } = db;
const path = require('path');

module.exports = {

     async getCreate(req, res) {
        const users = await User.findAll({
                attributes: ["id", "name", "role"]
        });

        
        res.render("course/courseCreate", {
                users: users.map(user => user.toJSON())
        });;  
    },
    
    
    async createCourse(req, res) {
        try {
           
            const { title, description, category, owner_id, status} = req.body;
            const imagem = req.imageName;
        
            const owner = await User.findByPk(owner_id, {
                attributes: ["id" , "name" , "role",]
            });

            console.log(owner.role);

            if (!owner || owner.role == "aluno") {
                console.log("criador precisa ser professor para criar curso");
                return res.status(404).send("CRIADOR NAO PODE SER ALUNO!");
            }
            const newCourse = await Course.create({
                title,
                description,
                category,
                owner_id,
                status,
                imagem
            });

            console.log("Criou o curso!");
            res.redirect("/home");
        } catch (err) {
            console.error("Error creating course:", err);
        }
    },

    
    async getAllCourses(req, res) {
        try {

            const courses = await Course.findAll({
                attributes: ["id", "title", "description","category", "owner_id", "imagem", "status"]
            });
            res.render("course/courseList", { courses: courses.map( course => course.toJSON()) });
            
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    },

    async getCourseById(req, res) {
        try {
            const courseId = req.params.id;
            const course = await Course.findByPk(courseId, {
                attributes: ["title" , "description" , "category" , "owner_id", "status", "imagem", "createdAt" ]
            });
            if (course) {
                console.log("achou o curso");
            } else {
                console.log("não achou o curso!");
            }
        } catch (err) {
            console.error("Error fetching course by ID:", err);
        }
    },

    async getUpdate(req, res) {
        const { title, course_id, duration_min, position } = req.body;

        const users = await User.findAll({
                attributes: ["id", "name", "role"]
            });

        const course = await Course.findByPk(req.params.id).then(
            course => res.render('course/courseUpdate', {
                course: course.dataValues, 
                users: users.map(user => user.toJSON())
            })
        ).catch(function (err) {
            console.log(err);
        });
    },

    async updateCourse(req, res) {
        try {
     
            const { id, title, description, category, owner_id, status } = req.body;
            const imagem = req.imageName;

            const owner = await User.findByPk(owner_id);
             const course = await Course.findByPk(id);
           
            if (!course) {
                console.log("não achou o curso!");
            }

            course.title = title || course.title;
            course.description = description || course.description;
            course.category = category || course.category;
            course.status = status || course.status;
            course.owner_id = owner_id || course.ownew_id;
            course.imagem = imagem || course.imagem;

            await course.save();
            console.log("EDITOU O CURSO!");

            res.redirect('/home');
        } catch (err) {
            console.error("Error updating course:", err);
        }
    },

    async deleteCourse(req, res) {
        try {
            const courseId = req.params.id;
            const course = await Course.findByPk(courseId);

            if (!course) {
                console.log("não achou o curso!");
            }

            await Lesson.destroy({ where: { course_id: courseId } });
            console.log("deletou as lições associadas ao curso!");        

            await course.destroy();
            console.log("deletou o curso");
            res.render('home')
        } catch (err) {
            console.error("Error deleting course:", err);
        }
    }
};
