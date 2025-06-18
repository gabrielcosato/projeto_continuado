const db = require('../config/db_sequelize');

module.exports = {
    async postUser(req, res) {
        try {
            const user= await db.User.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    },
    async getUsers(req, res) {
        try {
            const users = await db.User.findAll();
            res.status(200).json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar usuários' });
        }
    },
    async getUserById(req, res) {
        try {
            const user = await db.User.findByPk(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter usuário' });
        }
    },
    async putUser(req, res) {
        try {
            const [updated] = await db.User.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedUser = await db.User.findByPk(req.params.id);
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    },
    async deleteUser(req, res) {
        try {
            const deleted = await db.User.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar usuário' });
        }
    }
}