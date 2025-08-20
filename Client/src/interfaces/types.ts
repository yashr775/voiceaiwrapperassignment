export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  dueDate?: string | null;
  taskCount: number;
  completedTasks: number;
}

export interface Comment {
  id: string;
  content: string;
  authorEmail: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeEmail?: string | null;
  dueDate?: string | null;
  comments: Comment[];
}
