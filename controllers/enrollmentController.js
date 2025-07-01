const db = require('../config/db_sequelize');

module.exports = {

    
    async postEnrollment(req, res) {
        try {
            // Pega os IDs do corpo da requisição
            const { course_id, user_id } = req.body;

            // Verifica se o usuário existe
            const user = await db.User.findByPk(user_id);
            if (!user) {
                console.log(`Tentativa de matrícula falhou: Usuário com ID ${user_id} não encontrado.`);
                return res.status(404).send({ error: "User not found. Cannot create an enrollment for a non-existent user." });
            }

            // --- CORREÇÃO AQUI ---
            // Verifica se o curso existe usando a variável correta 'course_id'
            const course = await db.Course.findByPk(course_id);
            if (!course) {
                console.log(`Tentativa de matrícula falhou: Curso com ID ${course_id} não encontrado.`);
                return res.status(404).send({ error: "Course not found. Cannot create an enrollment for a non-existent course." });
            }

            // --- CORREÇÃO AQUI ---
            // Verifica se a matrícula já existe usando o model 'Enrollment' importado
            const existingEnrollment = await db.Enrollment.findOne({
                where: {
                    user_id: user_id,
                    course_id: course_id
                }
            });

            if (existingEnrollment) {
                console.log(`Tentativa de matrícula duplicada: Usuário ${user_id} já está no curso ${course_id}.`);
                return res.status(409).send({ error: "User is already enrolled in this course." });
            }

            // --- CORREÇÃO AQUI ---
            // Cria a matrícula usando o model 'Enrollment' importado
            const newEnrollment = await db.Enrollment.create({
                user_id,
                course_id,
                progress_percent: 0
            });

            console.log(`Matrícula criada com sucesso! Usuário ${user.id} matriculado no curso ${course.id}.`);
            return res.status(201).json(newEnrollment);

        } catch (err) {
            console.error("Error creating enrollment:", err);
            return res.status(500).send({ error: "An internal server error occurred." });
        }
    },

    async getEnrollments(req, res) {
        try {
            const enrollments = await db.Enrollment.findAll({
                include: [
                    { model: db.User, as: 'user' },
                    { model: db.Course, as: 'course' }
                ]
            });
            res.status(200).json(enrollments);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar matrículas' });
        }
    },

    async getEnrollmentById(req, res) {
        try {
            const enrollment = await db.Enrollment.findByPk(req.params.id, {
                include: [
                    { model: db.User, as: 'user' },
                    { model: db.Course, as: 'course' }
                ]
            });
            if (enrollment) {
                res.status(200).json(enrollment);
            } else {
                res.status(404).json({ error: 'Matrícula não encontrada' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter matrícula' });
        }
    },

    async putEnrollment(req, res) {
        try {

            // --- CORREÇÃO AQUI ---
            // Verifica se o curso existe usando a variável correta 'course_id'
            const course = await db.Course.findByPk(req.body.course_id);
            if (!course) {
                console.log(`Tentativa de matrícula falhou: Curso com ID ${req.body.course_id} não encontrado.`);
                return res.status(404).send({ error: "Course not found. Cannot UPDATE an enrollment for a non-existent course." });
            }


            const [updated] = await db.Enrollment.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedEnrollment = await db.Enrollment.findByPk(req.params.id, {
                    include: [
                        { model: db.User, as: 'user' },
                        { model: db.Course, as: 'course' }
                    ]
                });
                res.status(200).json(updatedEnrollment);
            } else {
                res.status(404).json({ error: 'Matrícula não encontrada' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar matrícula' });
        }
    },

    async deleteEnrollment(req, res) {
        try {
            const deleted = await db.Enrollment.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Matrícula não encontrada' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar matrícula' });
        }
    }
};
