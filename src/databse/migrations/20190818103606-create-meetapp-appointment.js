module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('meetapp_appointments', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            // meetapp_schedule_id: {
            //     type: Sequelize.INTEGER,
            //     references: { model: 'meetapp_schedules', key: 'id' },
            //     onUpdate: 'CASCADE',
            //     onDelete: 'SET NULL',
            //     allowNull: true,
            // },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: queryInterface => {
        return queryInterface.dropTable('meetapp_appointments');
    },
};
