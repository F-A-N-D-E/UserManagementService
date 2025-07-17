import { NextFunction, Request, Response, Router } from 'express';
import { TypeGetUsers, TypeLoginUser, TypeRegistUser } from '../../../@types/type';
import validFIO from '../validation/validFIO.js';
import validBirthday from '../validation/validBirthday.js';
import validEmail from '../validation/validEmail.js';
import validPassword from '../validation/validPassword.js';
import { sequelize } from '../config/Sequelize.js';
import getSessions from '../untils/getSessions.js';

const router = Router();

// Промежуточное ПО для проверки аутендификации
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (getSessions(req).rol) {
        next();
    } else {
        res.send({ err: 'Этой функцией может пользоваться только авторизированный пользователь' });
    }
};

// Авторизация
router.get('/login', async (req, res) => {
    try {
        let { email, password } = req.query as unknown as TypeLoginUser;

        if (!email || !password) {
            return res.send({ err: 'Все поля должны быть заполнены' });
        }

        if (!validEmail(email)) {
            return res.send({ err: 'Некорректная почта' });
        } else if (!validPassword(password)) {
            return res.send({
                err: 'Пароль должен быть не менее 4-х символов и состоять из латинских букв и цифр',
            });
        }

        let [existingUsers] = (await sequelize.query(
            `SELECT * FROM users WHERE email = :email AND password = :password`,
            { replacements: { email, password } }
        )) as [TypeGetUsers[], TypeGetUsers];

        if (existingUsers.length === 0) {
            return res.send({ err: 'Неверный логин или пароль' });
        }

        req.session.rol = existingUsers[0].rol;
        req.session.idUser = existingUsers[0].id;

        res.send({ respon: 'ok' });
    } catch (err) {
        console.error('Ошибка при авторизации', err);
        res.send({ err: 'Ошибка сервера' });
    }
});

// Регистрация
router.post('/registration', async (req, res) => {
    try {
        let { FIO, birthday, email, password, rol } = JSON.parse(
            req.body.toString('utf-8')
        ) as TypeRegistUser;

        if (!FIO || !birthday || !email || !password || !rol) {
            return res.send({ err: 'Все поля должны быть заполнены' });
        }

        if (!validFIO(FIO)) {
            return res.send({
                err: 'ФИО должно быть написано на кириллице и состоять из трех слов, очевидно',
            });
        } else if (!validBirthday(birthday)) {
            return res.send({ err: 'Некорректная дата рождения' });
        } else if (!validEmail(email)) {
            return res.send({ err: 'Некорректная почта' });
        } else if (!validPassword(password)) {
            return res.send({
                err: 'Пароль должен быть не менее 4-х символов и состоять из латинских букв или цифр',
            });
        } else if (rol != 'user' && rol != 'admin') {
            return res.send({ err: 'Роль может быть либо "user", либо "admin"' });
        }

        let existingUsers = await sequelize.query(`SELECT id FROM users WHERE email = :email LIMIT 1`, {
            replacements: { email },
        });

        if (existingUsers[0].length > 0) {
            return res.send({ err: 'Пользователь с такой почтой уже существует' });
        }

        await sequelize.query(
            `
                INSERT INTO users (isActive, FIO, birthday, email, password, rol)
                VALUES (true, :FIO, :birthday, :email, :password, :rol);`,
            {
                replacements: {
                    FIO,
                    birthday,
                    email,
                    password,
                    rol,
                },
            }
        );

        return res.send({ respon: 'ok' });
    } catch (err) {
        console.error('Ошибка при регистрации', err);
        res.send({ err: 'Ошибка сервера' });
    }
});

// Получить всех пользователей
router.get('/all', isAuthenticated, async (req, res) => {
    try {
        if (getSessions(req).rol == 'user') {
            let [result] = await sequelize.query(`SELECT * FROM users WHERE id = :id`, {
                replacements: { id: getSessions(req).idUser },
            });
            return res.send({ respon: result });
        }

        let [result] = await sequelize.query(`SELECT * FROM users`);

        let arr = result.map((elem: TypeGetUsers) => {
            let { password, ...rest } = elem;
            return rest;
        });

        res.send({ respon: arr });
    } catch (err) {
        console.error('Ошибка при показе всех пользователей', err);
        res.send({ err: 'Ошибка сервера' });
    }
});

// Заблокировать/разблокировать пользователя
router.get('/block/:id', isAuthenticated, async (req, res) => {
    try {
        let id = +req.params.id;

        if (getSessions(req).rol === 'user' && getSessions(req).idUser !== id) {
            return res.send({ err: 'Пользователь может заблокировать только сам себя' });
        }

        let [existingUsers] = (await sequelize.query(`SELECT * FROM users WHERE id = :id`, {
            replacements: { id },
        })) as [TypeGetUsers[], TypeGetUsers];

        let user = existingUsers[0];

        if (existingUsers.length === 0) return res.send({ err: 'Пользователь не существует' });

        await sequelize.query(`UPDATE users SET isActive = NOT :isActive WHERE id = :id;`, {
            replacements: {
                isActive: user.isActive,
                id: user.id,
            },
        });

        res.send({ respon: 'ok' });
    } catch (err) {
        console.error('Ошибка при блокировке пользователя', err);
        res.send({ err: 'Ошибка сервера' });
    }
});

// Поиск
router.get('/search', isAuthenticated, async (req, res) => {
    try {
        if (!req.query.id) return res.send({ err: 'Введите ID' });
        if (isNaN(+req.query.id)) return res.send({ err: 'ID может быть только числом' });

        let id = +req.query.id;

        if (getSessions(req).rol == 'user' && getSessions(req).idUser != id) {
            return res.send({ err: 'Обычные пользователи могут найти только себя' });
        }

        let [users] = await sequelize.query(`SELECT * FROM users WHERE id = :id`, { replacements: { id } });

        if (users.length === 0) {
            return res.send({ err: 'Такого пользователя нет' });
        } else {
            return res.send({ respon: users });
        }
    } catch (err) {
        console.error('Ошибка при поиске пользователя', err);
        res.send({ err: 'Ошибка сервера' });
    }
});

export default router;
