module.exports = (sequelize, Sequelize) => {
    const Enrollment = sequelize.define("enrollment", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id'
            }
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        progress_percent: {
            type: Sequelize.INTEGER
        }
    });
    return Enrollment;
};
