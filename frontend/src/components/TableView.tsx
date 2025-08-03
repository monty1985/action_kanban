import React, { useState } from 'react';
import { ActionItem } from '../types/ActionItem';
import { actionItemsApi } from '../api/actionItems';
import EditItemForm from './EditItemForm';

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
      case 'high': return 'bg-red-900/30 text-red-400';
      case 'medium': return 'bg-yellow-900/30 text-yellow-400';
      case 'low': return 'bg-green-900/30 text-green-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-900/30 text-green-400';
      case 'todo': return 'bg-gray-900/30 text-gray-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  const getPersonColor = (person?: string) => {
    if (!person) return '';
    const colors: Record<string, string> = {
      'mohan': 'border-l-4 border-blue-600',
      'archana': 'border-l-4 border-pink-600',
      'arya': 'border-l-4 border-purple-600',
      'sairav': 'border-l-4 border-green-600'
    };
    return colors[person.toLowerCase()] || '';
  };

  const isOverdue = (item: ActionItem) => {
    if (!item.due_date || item.status === 'done') return false;
    const dueDate = new Date(item.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await actionItemsApi.delete(id);
        onUpdate();
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return '-';
    }
  };

  console.log('TableView rendering with items:', items.length);

  return (
    <>
      <div className="w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-1/4"
                  onClick={() => handleSort('title')}
                >
                  Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-24"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-24"
                  onClick={() => handleSort('priority')}
                >
                  Priority {sortField === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-28"
                  onClick={() => handleSort('category')}
                >
                  Category {sortField === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-28"
                  onClick={() => handleSort('for_whom')}
                >
                  For Whom {sortField === 'for_whom' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-32"
                  onClick={() => handleSort('due_date')}
                >
                  Due Date {sortField === 'due_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-32"
                  onClick={() => handleSort('assignee')}
                >
                  Assignee {sortField === 'assignee' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-32"
                  onClick={() => handleSort('created_at')}
                >
                  Created {sortField === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-lg">No action items found</p>
                      <p className="text-sm text-gray-600 mt-1">Create a new item to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-800 transition-colors duration-150 ${getPersonColor(item.for_whom)}`}
                    onDoubleClick={() => setEditingItem(item)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white truncate">{item.title}</span>
                        {item.description && (
                          <span className="text-xs text-gray-400 truncate mt-1">{item.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isOverdue(item) ? 'bg-red-900/30 text-red-400' : getStatusColor(item.status)
                      }`}>
                        {isOverdue(item) ? 'overdue' : item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        item.category === 'professional' 
                          ? 'bg-[#00a8ff]/20 text-[#00a8ff]' 
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {item.category === 'professional' ? '💼 Work' : '🏠 Personal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.for_whom && (
                        <span className="text-sm text-gray-300">
                          {item.for_whom}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <span className={isOverdue(item) ? 'text-red-400 font-semibold' : ''}>
                        {formatDate(item.due_date)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.assignee || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem(item);
                          }}
                          className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="text-red-400 hover:text-red-300 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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