const conf = {
    PORT: 3000,
    DB_NAME: 'usermanagementservice',
    DB_USERNAME: 'root',
    DB_PASSWORD: '1234',
    HOST: 'localhost',
    SESSION_SECRET: 'myLittlePony',
};

Object.defineProperties(conf, {
    PORT: {
        configurable: false,
        enumerable: false,
        writable: false,
    },
    DB_NAME: {
        configurable: false,
        enumerable: false,
        writable: false,
    },
    DB_USERNAME: {
        configurable: false,
        enumerable: false,
        writable: false,
    },
    DB_PASSWORD: {
        configurable: false,
        enumerable: false,
        writable: false,
    },
    HOST: {
        configurable: false,
        enumerable: false,
        writable: false,
    },
    SESSION_SECRET: {
        configurable: false,
        enumerable: false,
        writable: false,
    },
});

export default conf;
