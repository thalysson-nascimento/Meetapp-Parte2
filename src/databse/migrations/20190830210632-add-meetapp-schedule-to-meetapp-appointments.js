module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'meetapp_appointments',
            'meetapp_schedule_id',
            {
                type: Sequelize.INTEGER,
                references: { model: 'meetapp_schedules', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true,
            }
        );
    },

    down: queryInterface => {
        return queryInterface.removeCollumn(
            'meetapp_appointments',
            'meetapp_schedule_id'
        );
    },
};
