import type { Tag } from "./tag";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: Tag[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  tagIds?: number[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  completed?: boolean;
  tagIds?: number[];
}