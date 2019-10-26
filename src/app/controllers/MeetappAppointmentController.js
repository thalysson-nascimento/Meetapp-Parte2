import { isBefore, subHours, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import File from '../models/File';
import MeetappAppointment from '../models/MeetappAppointment';
// import Notification from '../schemas/Notification';
import MeetappSchedule from '../models/MeetappSchedule';
import Mail from '../lib/Mail';

class MeetappAppointmentController {
    async index(req, res) {
        const { page = 1, date } = req.query;

        const dateStart = startOfDay(parseISO(date));

        const meetappAppointment = await MeetappSchedule.findAll({
            where: {
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(dateStart), endOfDay(dateStart)],
                },
            },
            order: ['date'],
            attributes: ['id', 'date'],
            limit: 10,
            offset: (page - 1) * 10,
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
        return res.json(meetappAppointment);
    }

    async store(req, res) {
        const meetappScheduleId = req.params.id;

        const meetappSchedule = await MeetappSchedule.findByPk(
            meetappScheduleId
        );

        /**
         * Check row is empity
         *  */
        if (meetappSchedule === null) {
            return res.status(401).json({ error: 'Meetapp not found' });
        }

        /**
         * Check user create meetapp
         */
        if (meetappSchedule.user_id === req.userId) {
            return res.status(401).json({
                error: 'you cannot subscribe to meetapps that organizes',
            });
        }

        /**
         * Check past meetapp date
         */
        if (meetappSchedule.past) {
            return res.status(400).json({
                error:
                    'you cannot subscribe to meetapps that have already happened',
            });
        }

        /**
         * Check to meetapp subscribe
         */
        const subscribedUser = await MeetappAppointment.findOne({
            where: {
                user_id: req.userId,
            },
            include: [
                {
                    model: MeetappSchedule,
                    as: 'meetapp_schedule',
                    required: true,
                    where: {
                        date: meetappSchedule.date,
                    },
                },
            ],
        });

        if (subscribedUser) {
            return res.status(401).json({
                error: "you can't write on more than one meetaap at a time",
            });
        }

        const meetappAppointment = await MeetappAppointment.create({
            user_id: req.userId,
            meetapp_schedule_id: meetappScheduleId,
        });

        /**
         * Notify provider
         */
        // const user = await User.findByPk(req.userId);
        // const formatedDate = format(
        //     hourStart,
        //     "'dia' dd 'de' MMMM', ás' H:mm'h'",
        //     { locale: pt }
        // );

        // await Notification.create({
        //     content: `Novo agendamento Meetapp ${user.name} para o ${formatedDate}`,
        //     user: req.userId,
        // });

        return res.json(meetappAppointment);
    }

    async delete(req, res) {
        const meetappAppointment = await MeetappAppointment.findByPk(
            req.params.id,
            {
                include: [
                    {
                        model: MeetappSchedule,
                        as: 'meetapp_schedule',
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['name', 'email'],
                            },
                        ],
                    },
                ],
            }
        );

        if (meetappAppointment.user_id !== req.userId) {
            return res.status(401).json({
                error: "You don't have permission to cancel this meetapp",
            });
        }

        const dateWithSub = subHours(meetappAppointment.date, 2);

        if (isBefore(dateWithSub, new Date())) {
            return res
                .status(401)
                .json({ error: 'You con only meetapp 2 hours in advance' });
        }

        meetappAppointment.canceled_at = new Date();

        await meetappAppointment.save();

        await Mail.sendMail({
            to: `${meetappAppointment.meetapp_schedule.user.name}`,
            sunject: 'Email cancelado',
            text: 'Você tem um novo cancelamento',
        });

        return res.json(meetappAppointment);
    }
}

export default new MeetappAppointmentController();
