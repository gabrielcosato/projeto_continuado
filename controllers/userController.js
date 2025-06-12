const db = require('../models');
const User = db.user;
console.log(Object.keys(db));


module.exports = {
    async getLogin(req, res) {
        res.render("user/login", { layout: "noMenu.handlebars" });
    },

    async postLogin(req, res) {

        const users = await User.findAll({
            attributes: ["email","password","role"],
            where: { email: req.body.email, password: req.body.password }
        }).then(users => {
            if (users.length > 0) {
                //res . cookie (" userData ", user, { maxAge:30 *60*1000 , httpOnly:true });
                req.session.login = req.body.email;
                res.locals.login = req.body.email;

                const role = users[0].dataValues.role;
                req.session.role = role; // Armazena na sessão

                if (role === 'admin') {
                    res.locals.admin = true;
                }

                console.log("ALO MEU POVO");
                res.render('home');
            } else
                res.redirect('/');

        }).catch((err) => {
            console.log(err);
        });
    },

    async getLogout(req, res) {
        //res.cookie("userData", req.cookies.userData, { maxAge: 0, httpOnly: true });
        req.session.destroy();
        res.redirect('/');
    },

    async getCreate(req, res) {
        res.render("user/userCreate");
    },

    async postCreate(req, res) {
        try {
            const { name, email, password, role } = req.body;

            const newUser = await User.create({
                name: name,
                email: email,
                password: password,
                role: role
            });
            console.log(`User ${newUser.email} criado com sucesso.`);
            res.redirect("/home");
        } catch (err) {
            console.error("Registration error:", err);
        }
    },

    async getUserList(req, res) {
        try {
            const users = await User.findAll({
                attributes: ["id", "name", "email", "password", "role"]
            });
            res.render("user/userList", { users: users.map(user => user.toJSON()) });
        } catch (err) {
            console.error("Error fetching user list:", err);
        }
    },


    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId, {
                attributes: ["id", "name", "email", "password", "role", "createdAt", "updatedAt"]
            });
            if (user) {
                console.log("achou o usuario");
            } else {
                console.log("não achou o user!");
            }
        } catch (err) {
            console.error("Error fetching user by ID:", err);
        }
    },

    async getUpdate(req, res) {
        const user = await User.findByPk(req.params.id).then(
            user => res.render('user/userUpdate',
                {
                    user: user.dataValues,
                })
        ).catch(function (err) {
            console.log(err);
        });
    },

    async updateUser(req, res) {
        try {
            const { id, name, email, password, role } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                console.log("não achou o user!");
            }

            user.name = name || user.name;
            user.email = email || user.email;
            user.password = password || user.password;
            user.role = role || user.role;

            await user.save();
            console.log("EDITOU O USUARIO!");

            res.redirect('/home');
        } catch (err) {
            console.error("Error updating user:", err);
        }
    },

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            console.log(userId);
            const user = await User.findByPk(userId);

            if (!user) {
                console.log("não achou o user!");
            }

            await user.destroy();
            console.log("deletou o user.");
            res.render('home')
        } catch (err) {
            console.error("Error deleting user:", err);

        }
    }
};
