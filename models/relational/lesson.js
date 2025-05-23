module.exports = (sequelize, Sequelize) => {
    const Lesson = sequelize.define("lesson", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id'
            }
        },
        duration_min: {
            type: Sequelize.INTEGER
        },
        position: {
            type: Sequelize.INTEGER
        }
    });

    Lesson.associate = (models) => {
        Lesson.belongsTo(models.course, {
            foreignKey: "course_id",
            as: "course"
        });
    };


    return Lesson;
};
