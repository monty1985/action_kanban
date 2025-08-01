import axios from 'axios';
import { ActionItem, CreateActionItemDto, UpdateActionItemDto } from '../types/ActionItem';

const API_BASE = '/api/action-items';

export const actionItemsApi = {
  getAll: async (filters?: {
    status?: string;
    priority?: string;
    assignee?: string;
    search?: string;
  }): Promise<ActionItem[]> => {
    const response = await axios.get(API_BASE, { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ActionItem> => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  create: async (item: CreateActionItemDto): Promise<ActionItem> => {
    const response = await axios.post(API_BASE, item);
    return response.data;
  },

  update: async (id: string, updates: UpdateActionItemDto): Promise<ActionItem> => {
    const response = await axios.put(`${API_BASE}/${id}`, updates);
    return response.data;
  },

  updateStatus: async (id: string, status: ActionItem['status']): Promise<ActionItem> => {
    const response = await axios.patch(`${API_BASE}/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  }
};