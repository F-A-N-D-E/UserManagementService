import express from 'express';
import router from './router/serviceRouter.js';
import conf from './config/conf.js';
import { setRecords, Users } from './config/Sequelize.js';
import session from 'express-session';

(async () => {
    try {
        const app = express();

        try {
            await Users.sync({ force: true });
            await setRecords();
        } catch (err) {
            console.error('Ошибка при инициализации базы данных: ' + err);
            process.exit(1);
        }

        app.use(
            session({
                secret: conf.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
            })
        );

        app.use(express.raw({ type: '*/*', limit: '10mb' }));

        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });

        app.use('/', router);

        app.listen(conf.PORT, () => {
            console.log(`Сервер запущен на порту: ${conf.PORT}`);
        }).on('error', err => {
            console.error('Ошибка при запуске сервера', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('Критическая ошибка инициализации приложения:', err);
        process.exit(1);
    }
})();
