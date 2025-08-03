#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:13000';

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'create_action_item',
    description: 'Create a new action item. Automatically categorizes as "professional" if title/description contains "work", "project", or "professional". Otherwise defaults to "personal".',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the action item' },
        description: { type: 'string', description: 'Detailed description' },
        status: { 
          type: 'string', 
          enum: ['todo', 'done'],
          description: 'Current status'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Priority level'
        },
        category: {
          type: 'string',
          enum: ['personal', 'professional'],
          description: 'Category of the item (defaults to personal, auto-detects professional)'
        },
        for_whom: { type: 'string', description: 'For whom this action is (e.g., Arya, Sairav, Archana, Mohan)' },
        due_date: { type: 'string', description: 'Due date in ISO format' },
        assignee: { type: 'string', description: 'Person assigned to this item' },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags for categorization'
        }
      },
      required: ['title']
    }
  },
  {
    name: 'list_action_items',
    description: 'List all action items with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        status: { 
          type: 'string', 
          enum: ['todo', 'done'],
          description: 'Filter by status'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Filter by priority'
        },
        category: {
          type: 'string',
          enum: ['personal', 'professional'],
          description: 'Filter by category (personal or professional)'
        },
        for_whom: { type: 'string', description: 'Filter by for whom' },
        assignee: { type: 'string', description: 'Filter by assignee' },
        search: { type: 'string', description: 'Search in title, description, and assignee' }
      }
    }
  },
  {
    name: 'update_action_item',
    description: 'Update an existing action item',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID of the action item to update' },
        title: { type: 'string', description: 'New title' },
        description: { type: 'string', description: 'New description' },
        status: { 
          type: 'string', 
          enum: ['todo', 'done'],
          description: 'New status'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'New priority'
        },
        category: {
          type: 'string',
          enum: ['personal', 'professional'],
          description: 'New category'
        },
        for_whom: { type: 'string', description: 'For whom this action is' },
        due_date: { type: 'string', description: 'New due date in ISO format' },
        assignee: { type: 'string', description: 'New assignee' },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'New tags'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'change_status',
    description: 'Quickly change the status of an action item',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID of the action item' },
        status: { 
          type: 'string', 
          enum: ['todo', 'done'],
          description: 'New status'
        }
      },
      required: ['id', 'status']
    }
  },
  {
    name: 'search_action_items',
    description: 'Search action items by text',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' }
      },
      required: ['query']
    }
  },
  {
    name: 'delete_action_item',
    description: 'Delete an action item',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID of the action item to delete' }
      },
      required: ['id']
    }
  }
];

// Create server instance
const server = new Server(
  {
    name: 'action-kanban-mcp',
    version: '1.0.0',
    vendor: 'action-kanban'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_action_item': {
        let data = args || {};
        
        // Auto-detect category if not provided
        if (!data.category) {
          const text = `${data.title || ''} ${data.description || ''}`.toLowerCase();
          const professionalKeywords = ['work', 'project', 'professional', 'meeting', 'client', 'deadline', 'business'];
          
          if (professionalKeywords.some(keyword => text.includes(keyword))) {
            data.category = 'professional';
          } else {
            data.category = 'personal';
          }
        }
        
        const response = await axios.post(`${API_BASE_URL}/api/action-items`, data);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      }

      case 'list_action_items': {
        const params = new URLSearchParams();
        if (args?.status) params.append('status', args.status as string);
        if (args?.priority) params.append('priority', args.priority as string);
        if (args?.category) params.append('category', args.category as string);
        if (args?.for_whom) params.append('for_whom', args.for_whom as string);
        if (args?.assignee) params.append('assignee', args.assignee as string);
        if (args?.search) params.append('search', args.search as string);
        
        const response = await axios.get(`${API_BASE_URL}/api/action-items?${params}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      }

      case 'update_action_item': {
        if (!args || !('id' in args)) {
          throw new Error('Missing required parameter: id');
        }
        const { id, ...updates } = args as any;
        const response = await axios.put(`${API_BASE_URL}/api/action-items/${id}`, updates);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      }

      case 'change_status': {
        if (!args || !('id' in args) || !('status' in args)) {
          throw new Error('Missing required parameters: id and status');
        }
        const { id, status } = args as any;
        const response = await axios.patch(`${API_BASE_URL}/api/action-items/${id}/status`, { status });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      }

      case 'search_action_items': {
        if (!args || !('query' in args)) {
          throw new Error('Missing required parameter: query');
        }
        const response = await axios.get(`${API_BASE_URL}/api/action-items?search=${(args as any).query}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      }

      case 'delete_action_item': {
        if (!args || !('id' in args)) {
          throw new Error('Missing required parameter: id');
        }
        await axios.delete(`${API_BASE_URL}/api/action-items/${(args as any).id}`);
        return {
          content: [
            {
              type: 'text',
              text: `Action item ${(args as any).id} deleted successfully`
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Action Kanban MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});