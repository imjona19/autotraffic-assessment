import type { Response } from 'express';
import { TagService } from '../services/tagService.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const tagService = new TagService();

export class TagController {
    
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const tags = await tagService.getTagsByUser(req.userId!);
        res.status(200).json(tags);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error al obtener etiquetas', error });
    }
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { name, color } = req.body;
        if (!name) {
            res.status(400).json({ message: 'El nombre es obligatorio' });
            return;
        }
        const tag = await tagService.createTag({ name, color, userId: req.userId! });
        res.status(201).json(tag);
    } 
    catch (error: any) {
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'Ya tienes una etiqueta con ese nombre' });
        return;
      }
      res.status(500).json({ message: 'Error al crear etiqueta', error });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        await tagService.deleteTag(Number(id), req.userId!);
        res.status(200).json({ message: 'Etiqueta eliminada' });
    } 
    catch (error: any) {
        res.status(404).json({ message: error.message });
    }
  }
}