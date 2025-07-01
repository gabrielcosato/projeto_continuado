const db = require("../config/db_sequelize");

const cloudinary = require("../cloudinary");


module.exports = {

    async getCreate(req, res) {
        const courses = await db.Course.findAll({
            attributes: ["id", "title"]
        });
        res.render("lesson/lessonCreate", {
            courses: courses.map(course => course.toJSON())
        });;
    },

    async postLesson(req, res) {
        try {
            const { title, resume, course_id, pdf_url, video_url, duration_min, position } = req.body;


            const course = await db.Course.findByPk(course_id);
            if (!course) {
                console.log("nao achou um curso para associar a licao");
                return res.status(404).send("Course not found. Cannot add lesson to a non-existent course.");
            }

            let pdfUrl = null;

            if (req.file) {
                console.log("Recebendo arquivo para enviar ao Cloudinary...");

                try {
                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            {
                                resource_type: "raw", // obrigatorio p/ PDF
                                folder: "pdfs"
                            },
                            (err, result) => {
                                if (err) {
                                    console.error("Cloudinary upload error:", err);
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            }
                        ).end(req.file.buffer);
                    });

                    pdfUrl = result.secure_url;
                    console.log("Arquivo PDF enviado para Cloudinary:", pdfUrl);
                } catch (err) {
                    console.error("Erro Cloudinary:", err);
                    return res.status(500).send("Erro ao enviar PDF para o Cloudinary");
                }
            }

            const newLesson = await db.Lesson.create({
                title,
                resume,
                course_id,
                pdf_url: pdfUrl,
                video_url,
                duration_min,
                position
            });
            return res.status(201).json(newLesson);
            console.log("licao criada com sucesso!");
            res.redirect("/home");
        } catch (err) {
            console.error("Error creating lesson:", err);
        }
    },

    async getLessons(req, res) {
        try {
            const lessons = await db.Lesson.findAll({
                include: [
                    { model: db.Course, as: 'course' }
                ]
            });
            res.status(200).json(lessons);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar lessons' });
        }
    },

    async getLessonById(req, res) {
        try {
                    const lesson = await db.Lesson.findByPk(req.params.id, {
                        include: [
                            { model: db.Course, as: 'course' }
                        ]
                    });
                    if (lesson) {
                        res.status(200).json(lesson);
                    } else {
                        res.status(404).json({ error: 'Lesson não encontrada' });
                    }
                } catch (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Erro ao obter lesson' });
                }
    },

    async getUpdate(req, res) {
        const { title, course_id, duration_min, position } = req.body;

        const courses = await db.Course.findAll({
            attributes: ["id", "title"]
        });

        const lesson = await db.Lesson.findByPk(req.params.id).then(
            lesson => res.render('lesson/lessonUpdate',
                {
                    lesson: lesson.dataValues,
                    courses: courses.map(course => course.toJSON())
                })
        ).catch(function (err) {
            console.log(err);
        });
    },

    async putLesson(req, res) {
    try {
        // 1. Pegar o ID do parâmetro e buscar a lição para garantir que ela existe
        const { id } = req.params;
        const lesson = await db.Lesson.findByPk(id);

        if (!lesson) {
            return res.status(404).json({ error: 'Lição não encontrada para o ID fornecido.' });
        }

        // 2. Preparar os dados de TEXTO para atualização a partir do corpo da requisição
        const { title, resume, course_id, video_url, duration_min, position } = req.body;
        const dataToUpdate = {
            title,
            resume,
            course_id,
            video_url,
            duration_min,
            position
        };

        const course = await db.Course.findByPk(course_id);
            if (!course) {
                console.log("nao achou um curso para associar a licao");
                return res.status(404).send("Course not found. Cannot add lesson to a non-existent course.");
            }

        // 3. Verificar se um NOVO ARQUIVO PDF foi enviado na requisição
        if (req.file) {
            console.log("Recebendo novo arquivo PDF para atualizar...");

            // Reutilizamos EXATAMENTE a mesma lógica de upload do seu postLesson!
            try {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            resource_type: "raw",
                            folder: "pdfs"
                        },
                        (err, result) => {
                            if (err) {
                                console.error("Cloudinary upload error:", err);
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        }
                    ).end(req.file.buffer);
                });

                // Adiciona a nova URL do PDF ao nosso objeto de atualização
                dataToUpdate.pdf_url = result.secure_url;
                console.log("Novo PDF enviado para Cloudinary:", dataToUpdate.pdf_url);

            } catch (err) {
                console.error("Erro Cloudinary:", err);
                return res.status(500).send("Erro ao enviar o novo PDF para o Cloudinary");
            }
        }

        // 4. Aplicar as atualizações (texto e/ou PDF) na instância da lição
        await lesson.update(dataToUpdate);

        // 5. Retornar a lição completa e atualizada
        return res.status(200).json(lesson);

    } catch (err) {
        console.error("Error updating lesson:", err);
        return res.status(500).json({ error: 'Ocorreu um erro interno ao atualizar a lição.' });
    }
},

    async deleteLesson(req, res) {
        try {
                    const deleted = await db.Lesson.destroy({
                        where: { id: req.params.id }
                    });
                    if (deleted) {
                        res.status(204).json();
                    } else {
                        res.status(404).json({ error: 'Lesson não encontrada' });
                    }
                } catch (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Erro ao deletar lesson' });
                }
    }
};
