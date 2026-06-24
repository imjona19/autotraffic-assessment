export interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  completed?: boolean;
}