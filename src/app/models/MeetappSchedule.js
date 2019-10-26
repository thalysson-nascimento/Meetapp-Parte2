import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

class MeetappSchedule extends Model {
    static init(sequelize) {
        super.init(
            {
                titulo_meetapp: Sequelize.STRING,
                descricao: Sequelize.STRING,
                localizacao: Sequelize.STRING,
                date: Sequelize.DATE,
                canceled_at: Sequelize.DATE,
                past: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return isBefore(this.date, new Date());
                    },
                },
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.File, { foreignKey: 'file_id', as: 'file' });
        this.hasMany(models.MeetappAppointment, {
            foreignKey: 'meetapp_schedule_id',
            as: 'meetapp_schedule_id',
        });
    }
}

export default MeetappSchedule;
