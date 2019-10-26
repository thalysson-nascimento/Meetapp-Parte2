import * as Yup from 'yup';
import { parseISO, startOfHour, isBefore, subHours } from 'date-fns';
// import { Op } from 'sequelize';

// import MeetappAppointment from '../models/MeetappAppointment';
import MeetappSchedule from '../models/MeetappSchedule';
import User from '../models/User';
import File from '../models/File';

class MeetappScheduleController {
    async index(req, res) {
        // /**
        //  * Check user is provider
        //  */
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });

        if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not a provider' });
        }

        const meetappSchedule = await MeetappSchedule.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['id'],
            attributes: [
                'id',
                'titulo_meetapp',
                'descricao',
                'localizacao',
                'date',
            ],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });

        return res.json(meetappSchedule);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            date: Yup.date().required(),
            titulo_meetapp: Yup.string().required(),
            descricao: Yup.string().required(),
            localizacao: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'validation fails' });
        }

        const { date, titulo_meetapp, descricao, localizacao } = req.body;

        /**
         * Check for past date
         */
        const hourStart = startOfHour(parseISO(req.body.date));

        if (isBefore(hourStart, new Date())) {
            return res
                .status(400)
                .json({ error: 'Past date are not permitted' });
        }

        /**
         * Check user is provider
         */
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });

        if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not a provider' });
        }

        const meetappSchedule = await MeetappSchedule.create({
            user_id: req.userId,
            date,
            titulo_meetapp,
            descricao,
            localizacao,
        });

        return res.json(meetappSchedule);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            date: Yup.date().required(),
            titulo_meetapp: Yup.string().required(),
            descricao: Yup.string().required(),
            localizacao: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'validation fails' });
        }

        const meetappSchedule = await MeetappSchedule.findByPk(req.params.id);

        const { date, titulo_meetapp, descricao, localizacao } = req.body;

        /**
         * Check row is empity
         *  */
        if (meetappSchedule === null) {
            return res.status(401).json({ error: 'Meetapp not found' });
        }

        /**
         * Check user meetapp
         */
        if (meetappSchedule.user_id !== req.userId) {
            return res.status(401).json({
                error: "You don't have permission to update this meetapp",
            });
        }

        /**
         * Check for past date
         */
        const hourStart = startOfHour(parseISO(req.body.date));

        if (isBefore(hourStart, new Date())) {
            return res
                .status(401)
                .json({ error: 'Past date are not permitted' });
        }

        /**
         * Check user is provider
         */
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });

        if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not a provider' });
        }

        // const updateMeetapp = await MeetappSchedule.update(req.body);

        const updateMeetap = await meetappSchedule.update({
            where: { id: req.params.id },
            date,
            titulo_meetapp,
            descricao,
            localizacao,
        });

        return res.json(updateMeetap);
    }

    async delete(req, res) {
        const meetappSchedule = await MeetappSchedule.findByPk(req.params.id);

        /**
         * Check row is empity
         *  */
        if (meetappSchedule === null) {
            return res.status(401).json({ error: 'Meetapp not found' });
        }

        /**
         * Check user meetapp
         */
        if (meetappSchedule.user_id !== req.userId) {
            return res.status(401).json({
                error: "You don't have permission to delete this meetapp",
            });
        }

        /**
         * Check hour for delete meetapp
         */
        const dateWhitSub = subHours(meetappSchedule.date, 2);

        if (isBefore(dateWhitSub, new Date())) {
            return res.status(401).json({
                error: 'you can only to delete meetapp 2 hours  in advance',
            });
        }

        const deleteMeetapp = meetappSchedule.destroy(meetappSchedule);

        return res.json(deleteMeetapp);
    }
}

export default new MeetappScheduleController();
