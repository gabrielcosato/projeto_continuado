const db = require('../config/db_sequelize');

module.exports = {
    async postEvaluation(req, res) {
        try {

            // --- CORREÇÃO AQUI ---
            // Verifica se o curso existe usando a variável correta 'course_id'
            const course = await db.Course.findByPk(req.body.course_id);
            if (!course) {
                console.log(`Tentativa de avaliação falhou: Curso com ID ${req.body.course_id} não encontrado.`);
                return res.status(404).send({ error: "Course not found. Cannot create an evaluation for a non-existent course." });
            }

            const evaluation = await db.Evaluation.create(req.body);
            res.status(201).json(evaluation);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar avaliação' });
        }
    },

    async getEvaluations(req, res) {
        try {
            const evaluations = await db.Evaluation.findAll({
                include: { model: db.Course, as: 'course' }
            });
            res.status(200).json(evaluations);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar avaliações' });
        }
    },

    async getEvaluationById(req, res) {
        try {
            const evaluation = await db.Evaluation.findByPk(req.params.id, {
                include: { model: db.Course, as: 'course' }
            });
            if (evaluation) {
                res.status(200).json(evaluation);
            } else {
                res.status(404).json({ error: 'Avaliação não encontrada' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter avaliação' });
        }
    },

    async putEvaluation(req, res) {
        try {
            // Verifica se o curso existe usando a variável correta 'course_id'
            const course = await db.Course.findByPk(req.body.course_id);
            if (!course) {
                console.log(`Tentativa de avaliação falhou: Curso com ID ${req.body.course_id} não encontrado.`);
                return res.status(404).send({ error: "Course not found. Cannot UPDATE an evaluation for a non-existent course." });
            }

            const [updated] = await db.Evaluation.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedEvaluation = await db.Evaluation.findByPk(req.params.id, {
                    include: { model: db.Course, as: 'course' }
                });
                res.status(200).json(updatedEvaluation);
            } else {
                res.status(404).json({ error: 'Avaliação não encontrada' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar avaliação' });
        }
    },

    async deleteEvaluation(req, res) {
        try {
            const deleted = await db.Evaluation.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Avaliação não encontrada' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar avaliação' });
        }
    }
};
