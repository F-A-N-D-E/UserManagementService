import { Request } from 'express';
import { SessionData } from 'express-session';

export default function getSessions(req: Request) {
    let arr = Object.values((req.sessionStore as any).sessions as unknown as string[]);

    if (arr.length == 0) return {} as SessionData;

    return JSON.parse(arr[arr.length - 1]) as SessionData;
}
