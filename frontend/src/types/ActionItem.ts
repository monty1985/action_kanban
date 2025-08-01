export interface ActionItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  updated_at: string;
  assignee?: string;
  tags?: string[];
}

export type CreateActionItemDto = Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>;
export type UpdateActionItemDto = Partial<CreateActionItemDto>;