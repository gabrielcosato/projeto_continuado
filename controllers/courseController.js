const db = require('../config/db_sequelize');

module.exports = {
    async postCourse(req, res) {
        try {

            const { owner_id, title, description, category, imagem, status } = req.body;

            const owner = await db.User.findByPk(owner_id);
            if (!owner) {
                return res.status(404).json({ error: "Usuário " + (owner_id) + " não encontrado" });
            }

            const course = await db.Course.create(req.body);
            res.status(201).json(course);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar a course' });
        }
    },
    async getCourses(req, res) {
        try {
            const courses = await db.Course.findAll();
            res.status(200).json(courses);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar courses' });
        }
    },
    async getCourseById(req, res) {
        try {
            const course = await db.Course.findByPk(req.params.id);
            if (course) {
                res.status(200).json(course);
            } else {
                res.status(404).json({ error: 'Course não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter course' });
        }
    },
    async putCourse(req, res) {
        try {
            const [updated] = await db.Course.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedCourse = await db.Course.findByPk(req.params.id);
                res.status(200).json(updatedCourse);
            } else {
                res.status(404).json({ error: 'Course não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar course' });
        }
    },
    async deleteCourse(req, res) {
        try {
            const deleted = await db.Course.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Course não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar course' });
        }
    }
}