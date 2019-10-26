import { Op } from 'sequelize';
import MeetappSchedule from '../models/MeetappSchedule';
import File from '../models/File';

class MeetappListUser {
    async index(req, res) {
        const meetappSchedule = await MeetappSchedule.findAll({
            where: {
                date: {
                    [Op.gt]: new Date(),
                },
            },
            attributes: [
                'id',
                'titulo_meetapp',
                'descricao',
                'localizacao',
                'date',
            ],
            include: [
                {
                    model: File,
                    as: 'file',
                    attributes: ['id', 'path', 'url'],
                },
            ],
            oder: [[MeetappSchedule, 'date']],
        });

        return res.json(meetappSchedule);
    }
}

export default new MeetappListUser();
