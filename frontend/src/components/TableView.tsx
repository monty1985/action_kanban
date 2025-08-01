import React, { useState } from 'react';
import { ActionItem } from '../types/ActionItem';
import { format } from 'date-fns';
import { actionItemsApi } from '../api/actionItems';
import EditItemForm from './EditItemForm';
import { formatDate, parseLocalDate } from '../utils/dateUtils';

interface TableViewProps {
  items: ActionItem[];
  onUpdate: () => void;
}

const TableView: React.FC<TableViewProps> = ({ items, onUpdate }) => {
  const [sortField, setSortField] = useState<keyof ActionItem>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null);

  const handleSort = (field: keyof ActionItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    const order = sortOrder === 'asc' ? 1 : -1;
    return aVal > bVal ? order : -order;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-green-400 bg-green-900/20';
      case 'in_progress': return 'text-blue-400 bg-blue-900/20';
      case 'review': return 'text-purple-400 bg-purple-900/20';
      case 'todo': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const handleRowDoubleClick = (item: ActionItem) => {
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await actionItemsApi.delete(id);
        onUpdate();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  return (
    <>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('title')}
            >
              Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('status')}
            >
              Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('priority')}
            >
              Priority {sortField === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('due_date')}
            >
              Due Date {sortField === 'due_date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('assignee')}
            >
              Assignee {sortField === 'assignee' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('created_at')}
            >
              Created {sortField === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {sortedItems.map((item) => (
            <tr 
              key={item.id} 
              className="hover:bg-[#2a2a2a]/50 cursor-pointer transition-colors" 
              onDoubleClick={() => handleRowDoubleClick(item)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  {item.description && (
                    <div className="text-sm text-gray-400">{item.description}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(item.due_date, 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {item.assignee || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {format(parseLocalDate(item.created_at), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingItem(item);
                  }}
                  className="text-[#00ff88] hover:text-[#00ff88]/80 mr-2 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {editingItem && (
      <EditItemForm
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdated={() => {
          setEditingItem(null);
          onUpdate();
        }}
      />
    )}
    </>
  );
};

export default TableView;