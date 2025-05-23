module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("course", {
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
        description: {
            type: Sequelize.TEXT
        },
        category: {
            type: Sequelize.STRING
        },
        owner_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        status: {
            type: Sequelize.STRING
        }
    });

    Course.associate = (models) => {
        Course.hasMany(models.lesson, {
            foreignKey: "course_id",
            as: "lessons"
        });
    };

    return Course;
};
