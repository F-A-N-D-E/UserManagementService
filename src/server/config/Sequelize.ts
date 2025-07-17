import { DataTypes, Sequelize } from 'sequelize';
import conf from './conf.js';

export const sequelize = new Sequelize(
    conf.DB_NAME,
    conf.DB_USERNAME,
    conf.DB_PASSWORD,
    {
        host: conf.HOST,
        dialect: 'mysql',
        define: {
            freezeTableName: true,
            timestamps: false,
        },
    }
);

export const Users = sequelize.define(
    'Users', // свойста таблицы
    {
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        FIO: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthday: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rol: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
);

export async function setRecords() {
    await Users.create({
        isActive: true,
        FIO: 'Ложкин Андрей Геннадьевич',
        birthday: '23.10.2004',
        email: 'andrei.lozhkin2015@yandex.ru',
        password: '1234',
        rol: 'admin',
    });
    await Users.create({
        isActive: true,
        FIO: 'Менторов Артем Менторович', // :)
        birthday: '24.10.2004',
        email: 'mentor@yandex.ru',
        password: '1234',
        rol: 'user',
    });
    await Users.create({
        isActive: true,
        FIO: 'Головкина Софья Эйчаровна', // :)
        birthday: '25.10.2004',
        email: 'sofiagolovkina@yandex.ru',
        password: '5678',
        rol: 'user',
    });
    await Users.create({
        isActive: true,
        FIO: 'Думов Палач Слейрович',
        birthday: '26.10.2004',
        email: 'Doom@yandex.ru',
        password: '5678',
        rol: 'user',
    });
    await Users.create({
        isActive: true,
        FIO: 'Скайрим Довакин Довакинович',
        birthday: '27.10.2004',
        email: 'skyrim@yandex.ru',
        password: '5678',
        rol: 'user',
    });
}
