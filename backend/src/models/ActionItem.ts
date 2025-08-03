export interface ActionItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'done';
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'professional';
  for_whom?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  assignee?: string;
  tags?: string[];
}

export type CreateActionItemDto = Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>;
export type UpdateActionItemDto = Partial<CreateActionItemDto>;