import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import MeetappAppointment from '../app/models/MeetappAppointment';
import MeetappSchedule from '../app/models/MeetappSchedule';

import databaseConfig from '../config/database';

/**
 * Arquivo responsável por manter a conexão com o banco de dados e carregar todas as models
 * */
const models = [User, File, MeetappAppointment, MeetappSchedule];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }

    mongo() {
        this.mongooseConnection = mongoose.connect(
            'mongodb://192.168.99.100:27017/meetapp',
            { useNewUrlParser: true, useFindAndModify: true }
        );
    }
}

export default new Database();
