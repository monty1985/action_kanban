import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ActionItem } from '../types/ActionItem';
import { actionItemsApi } from '../api/actionItems';
import EditItemForm from './EditItemForm';
import { formatDate } from '../utils/dateUtils';

interface KanbanBoardProps {
  items: ActionItem[];
  onUpdate: () => void;
}

const columns = [
  { id: 'todo', title: 'To Do', color: '#666' },
  { id: 'overdue', title: 'Overdue', color: '#ff6b6b' },
  { id: 'done', title: 'Done', color: '#00ff88' }
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ items, onUpdate }) => {
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa94d';
      case 'low': return '#00ff88';
      default: return '#666';
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const itemId = result.draggableId;
    const destinationId = result.destination.droppableId;
    
    // Overdue is not a status, only handle todo and done
    if (destinationId === 'overdue') {
      // Can't drag to overdue column
      return;
    }
    
    const newStatus = destinationId as ActionItem['status'];
    
    try {
      await actionItemsApi.updateStatus(itemId, newStatus);
      onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const isOverdue = (item: ActionItem) => {
    if (!item.due_date || item.status === 'done') return false;
    const dueDate = new Date(item.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const sortByPriority = (items: ActionItem[]) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const getItemsByColumn = (columnId: string) => {
    let filtered: ActionItem[];
    if (columnId === 'overdue') {
      filtered = items.filter(item => item.status === 'todo' && isOverdue(item));
    } else if (columnId === 'todo') {
      filtered = items.filter(item => item.status === 'todo' && !isOverdue(item));
    } else {
      filtered = items.filter(item => item.status === columnId);
    }
    return sortByPriority(filtered);
  };

  const getPersonColor = (person?: string) => {
    if (!person) return 'bg-gray-700';
    const colors: Record<string, string> = {
      'mohan': 'bg-blue-600',
      'archana': 'bg-pink-600',
      'arya': 'bg-purple-600',
      'sairav': 'bg-green-600'
    };
    return colors[person.toLowerCase()] || 'bg-gray-700';
  };

  const handleCardDoubleClick = (item: ActionItem) => {
    console.log('Double click detected on item:', item.title);
    setEditingItem(item);
  };

  return (
    <>
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4">
        {columns.map(column => (
          <div 
            key={column.id} 
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex flex-col h-[calc(100vh-250px)] min-h-[400px]"
          >
            <div className="p-4 border-b border-[#2a2a2a]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {column.title}
                </h3>
                <span 
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ 
                    backgroundColor: `${column.color}20`,
                    color: column.color
                  }}
                >
                  {getItemsByColumn(column.id).length}
                </span>
              </div>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto p-3 space-y-2 ${
                    snapshot.isDraggingOver ? 'bg-[#00ff88]/5' : ''
                  }`}
                  style={{ maxHeight: 'calc(100vh - 320px)' }}
                >
                  {getItemsByColumn(column.id).map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`glass-card p-3 cursor-pointer relative ${
                            snapshot.isDragging 
                              ? 'rotate-2 scale-105' 
                              : ''
                          }`}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            handleCardDoubleClick(item);
                          }}
                          onMouseEnter={() => setHoveredCard(item.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          {hoveredCard === item.id && (
                            <button
                              className="absolute top-2 right-2 p-1 bg-[#00ff88]/20 hover:bg-[#00ff88]/30 rounded text-[#00ff88] transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem(item);
                              }}
                              title="Edit item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          {item.for_whom && (
                            <div className={`${getPersonColor(item.for_whom)} h-1 rounded-t-lg -m-3 mb-2`} />
                          )}
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-medium text-white line-clamp-2 flex-1 pr-2">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {item.for_whom && (
                                <span className="text-xs text-gray-400">
                                  {item.for_whom}
                                </span>
                              )}
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                item.category === 'professional' 
                                  ? 'bg-[#00a8ff]/20 text-[#00a8ff]' 
                                  : 'bg-purple-500/20 text-purple-400'
                              }`}>
                                {item.category === 'professional' ? '💼' : '🏠'}
                              </span>
                              <div 
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: getPriorityColor(item.priority) }}
                                title={`${item.priority} priority`}
                              />
                            </div>
                          </div>
                          
                          {item.description && (
                            <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs">
                            {item.assignee && (
                              <span className="text-gray-500 truncate max-w-[100px]">
                                👤 {item.assignee}
                              </span>
                            )}
                            {item.due_date && (
                              <span className={`${
                                isOverdue(item) ? 'text-red-400' : 'text-gray-500'
                              }`}>
                                📅 {formatDate(item.due_date, 'MMM d')}
                              </span>
                            )}
                          </div>
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.slice(0, 2).map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.5 bg-[#00ff88]/10 text-[#00ff88] text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                                  +{item.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {getItemsByColumn(column.id).length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
                      No items
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
    
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

export default KanbanBoard;