# Action Items Tracker

A modern task management application with a REST API, Kanban board UI, and MCP (Model Context Protocol) server integration for AI-powered task management.

## Features

- **REST API**: Full CRUD operations for action items
- **Dual Views**: 
  - Table view with sorting and inline editing
  - Kanban board with drag-and-drop functionality
- **MCP Integration**: Control your tasks through Claude Desktop or other MCP-compatible AI assistants
- **SQLite Database**: Lightweight, zero-configuration database
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Project Structure

```
action_kanban/
├── backend/          # Express.js REST API
├── mcp-server/       # MCP server wrapper
└── frontend/         # React frontend
```

## Setup Instructions

### 1. Backend API Setup

```bash
cd backend
npm install
npm run dev
```

The API will run on `http://localhost:3000` (or `http://localhost:13000` when using Docker)

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173` (or `http://localhost:15173` when using Docker)

### 3. MCP Server Setup

```bash
cd mcp-server
npm install
npm run build
```

## MCP Integration with Claude Desktop

### 1. Configure Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "action-kanban": {
      "command": "node",
      "args": ["/path/to/action_kanban/mcp-server/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:13000"
      }
    }
  }
}
```

Replace `/path/to/action_kanban` with the actual path to your project.

### 2. Restart Claude Desktop

After updating the configuration, restart Claude Desktop to load the MCP server.

### 3. Available MCP Commands

Once configured, you can use these commands in Claude:

- **Create Action Item**: "Create a new action item titled 'Review PR #123' with high priority"
- **List Items**: "Show me all my in-progress tasks"
- **Update Status**: "Change the status of task [id] to done"
- **Search**: "Find all tasks assigned to John"
- **Delete**: "Delete action item [id]"

## API Endpoints

- `GET /api/action-items` - List all items (supports filters: status, priority, assignee, search)
- `GET /api/action-items/:id` - Get single item
- `POST /api/action-items` - Create new item
- `PUT /api/action-items/:id` - Update item
- `PATCH /api/action-items/:id/status` - Update status only
- `DELETE /api/action-items/:id` - Delete item

## Action Item Schema

```typescript
{
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assignee?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
```

## Development

### Running Everything

1. Start the backend API:
   ```bash
   cd backend && npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend && npm run dev
   ```

3. The MCP server runs on-demand when called by Claude Desktop

### Technologies Used

- **Backend**: Node.js, Express, TypeScript, SQLite
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **MCP Server**: @modelcontextprotocol/sdk
- **UI Components**: react-beautiful-dnd for drag-and-drop

## Troubleshooting

### MCP Server Not Working

1. Ensure the backend API is running on port 3000
2. Check the Claude Desktop logs for errors
3. Verify the path in `claude_desktop_config.json` is correct
4. Make sure you've built the MCP server (`npm run build` in mcp-server/)

### Database Issues

The SQLite database file (`action_items.db`) is created automatically in the backend directory. To reset the database, simply delete this file and restart the backend.

## Future Enhancements

- [ ] Add authentication
- [ ] Implement real-time updates with WebSockets
- [ ] Add file attachments to action items
- [ ] Create mobile-responsive design improvements
- [ ] Add data export functionality