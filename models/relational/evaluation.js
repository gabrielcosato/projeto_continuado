module.exports = (sequelize, Sequelize) => {
    const Evaluation = sequelize.define("evaluation", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true, 
            references: {
                model: 'courses',
                key: 'id'
            }
        },
        overall_score: {
            type: Sequelize.INTEGER
        },
        comment: {
            type: Sequelize.TEXT
        }
    });
    return Evaluation;
};
