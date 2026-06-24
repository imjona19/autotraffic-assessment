import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/tasksRoutes.js';
import tagRoutes from './routes/tagRoutes.js';


const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Endpoint de control (Health Check)
app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tags', tagRoutes);

export default app;