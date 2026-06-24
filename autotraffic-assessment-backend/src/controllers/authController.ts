import type { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
  
    // POST /api/auth/login
    async login(req: Request, res: Response): Promise<void> {

        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: 'El email y la contraseña son obligatorios' });
                return;
            }

            const result = await authService.login({ email, password });
        
            res.status(200).json(result);
        } 
        catch (error: any) {
            res.status(401).json({ message: error.message || 'Error de autenticación' });
        }
    }

    // POST /api/auth/register
    async register(req: Request, res: Response): Promise<void> {
        
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                res.status(400).json({ message: 'Todos los campos son obligatorios' });
                return;
            }

            const newUser = await userService.createUser({ name, email, password });
            const { password: _, ...userWithoutPassword } = newUser;
        
            res.status(201).json({ message: 'Usuario registrado con éxito', user: userWithoutPassword });
        } 
        catch (error) {
            res.status(500).json({ message: 'Error al registrar el usuario', error });
        }
    }
}