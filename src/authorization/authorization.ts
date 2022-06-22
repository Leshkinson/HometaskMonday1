import {Request, Response, NextFunction} from "express";

const LOGIN = 'admin';
const PASSWORD = 'qwerty';
const TRUEPassword = 'Basic YWRtaW46cXdlcnR5';

export const basicAuthorization = (req: Request, res: Response, next: NextFunction) => {
    const authorization: string | undefined = req.headers.authorization;
    if (!authorization) {
        res.sendStatus(401)
        return;
    }
    if (authorization !== TRUEPassword) {
        res.sendStatus(401)
        return;
    }
    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii')
    const[login, password] = decoded.split(':');
    if (login !== LOGIN || password !== PASSWORD) {
        res.sendStatus(401)
        return;
    } else {
        next()
    }
}