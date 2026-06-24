import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    userId?: number;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Acceso denegado. Token no proporcionado o formato inválido.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if(token == null || token == undefined){
        res.status(401).json({ message: 'Token inválido o expirado.' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || '';

        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

        req.userId = Number(decoded.sub);

        next();
    } 
    catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};