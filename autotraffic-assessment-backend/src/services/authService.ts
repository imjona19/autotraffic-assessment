import { prisma } from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    private readonly jwtSecret: string;
    private readonly jwtExpiresIn: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || '';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';

        if (!this.jwtSecret) {
            throw new Error('La variable de entorno JWT_SECRET no está definida.');
        }
    }

    async login(data: { email: string; password: string }) {
        const user = await prisma.user.findFirst({
            where: { 
                email: data.email,
                active: true 
            }
        });

        if (!user) {
            new Error('Credenciales inválidas');
            throw new Error('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name
        };

        const token = jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn as any
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        };
    }
}