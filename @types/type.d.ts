import 'express-session';

export interface TypeResponFromServer<T = 'ok'> {
    respon?: T;
    err?: string;
}

export interface TypeLoginUser {
    email: string;
    password: string;
}

export interface TypeRegistUser extends TypeLoginUser {
    FIO: string;
    birthday: string;
    rol: 'admin' | 'user';
}

export interface TypeGetUsers extends TypeRegistUser {
    id: number;
    isActive: number;
}

declare module 'express-session' {
    interface SessionData {
        rol?: string;
        idUser?: number;
    }
}
