import Sequelize, { Model } from 'sequelize';

class MeetappAppointment extends Model {
    static init(sequelize) {
        super.init(
            {
                user_id: Sequelize.NUMBER,
                meetapp_schedule_id: Sequelize.NUMBER,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.MeetappSchedule, {
            foreignKey: 'meetapp_schedule_id',
            as: 'meetapp_schedule',
        });
    }
}

export default MeetappAppointment;
