# Claude Desktop MCP Integration Guide for Action Kanban

This guide will help you integrate the Action Kanban API with Claude Desktop using the Model Context Protocol (MCP).

## Prerequisites

1. **Claude Desktop** installed on your machine
2. **Action Kanban API** running (Docker containers should be up)
3. **Node.js** installed (for running the MCP server)

## Step 1: Verify API is Running

First, ensure your Action Kanban API is running:

```bash
# Check if containers are running
docker ps

# You should see:
# - action-kanban-backend (on port 13000)
# - action-kanban-frontend (on port 15173)
```

Test the API:
```bash
curl http://localhost:13000/api/action-items
```

## Step 2: Build the MCP Server

The MCP server is already built, but if you need to rebuild:

```bash
cd mcp-server
npm install
npm run build
```

## Step 3: Configure Claude Desktop

You need to edit Claude Desktop's configuration file to add the MCP server.

### On macOS:
Edit the file: `~/Library/Application Support/Claude/claude_desktop_config.json`

### On Windows:
Edit the file: `%APPDATA%\Claude\claude_desktop_config.json`

### On Linux:
Edit the file: `~/.config/Claude/claude_desktop_config.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "action-kanban": {
      "command": "node",
      "args": [
        "/Users/mohanakarthikeyan/Documents/Mohan/Projects/AI_LLM/action_kanban/mcp-server/dist/index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:13000"
      }
    }
  }
}
```

**Important**: Replace `/Users/mohanakarthikeyan/Documents/Mohan/Projects/AI_LLM/action_kanban` with your actual project path.

If you already have other MCP servers configured, add the "action-kanban" entry to the existing "mcpServers" object.

## Step 4: Restart Claude Desktop

After saving the configuration:

1. Quit Claude Desktop completely (make sure it's not running in the background)
2. Start Claude Desktop again
3. The MCP server should connect automatically

## Step 5: Verify MCP Connection

In Claude Desktop, you can verify the connection by typing:

"What tools do I have available?"

You should see the Action Kanban tools listed:
- `create_action_item` - Create a new action item
- `list_action_items` - List all action items with optional filters
- `update_action_item` - Update an existing action item
- `change_status` - Change the status of an action item
- `search_action_items` - Search action items by keyword
- `delete_action_item` - Delete an action item

## Step 6: Using the Action Kanban Tools

Here are example prompts you can use in Claude Desktop:

### Creating Items:
- "Create a new action item titled 'Review quarterly reports' with high priority due tomorrow"
- "Add a task for 'Update documentation' assigned to John with medium priority"

### Listing Items:
- "Show me all my action items"
- "List all high priority tasks"
- "What tasks are assigned to Sarah?"
- "Show me items in review status"

### Updating Items:
- "Change the status of 'Review quarterly reports' to in_progress"
- "Update the priority of 'Update documentation' to high"
- "Mark 'Deploy new features' as done"

### Searching:
- "Search for items containing 'deploy'"
- "Find all tasks related to documentation"

### Deleting:
- "Delete the action item with ID [paste-id-here]"

## Troubleshooting

### MCP Server Not Connecting:

1. **Check the logs**: Claude Desktop logs can be found at:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`
   - Linux: `~/.config/Claude/logs/`

2. **Verify the path**: Make sure the path in the config file is absolute and correct

3. **Check API is running**: Ensure `http://localhost:13000` is accessible

4. **Test MCP server manually**:
   ```bash
   cd mcp-server
   node dist/index.js
   ```
   You should see: "Action Kanban MCP Server running on stdio"

### Permission Issues:

If you get permission errors, make the script executable:
```bash
chmod +x mcp-server/dist/index.js
```

### API Connection Issues:

If the MCP server can't connect to the API:
1. Verify Docker containers are running: `docker ps`
2. Check the API URL in the config matches your setup
3. Try accessing the API directly: `curl http://localhost:13000/api/action-items`

## Advanced Configuration

### Using a Different API Port:

If your API runs on a different port, update the env variable in the config:
```json
"env": {
  "API_BASE_URL": "http://localhost:YOUR_PORT"
}
```

### Running MCP Server with npm:

Instead of using node directly, you can create a shell script:

1. Create `mcp-server/run.sh`:
   ```bash
   #!/bin/bash
   cd /path/to/action_kanban/mcp-server
   npm start
   ```

2. Make it executable: `chmod +x mcp-server/run.sh`

3. Update Claude config to use the script:
   ```json
   "command": "/path/to/action_kanban/mcp-server/run.sh",
   "args": []
   ```

## Example Workflow

1. **Morning Planning**:
   - "Show me all my tasks for today"
   - "Create a new task for the team meeting at 2 PM"
   - "Set priority high for tasks due today"

2. **Status Updates**:
   - "Change 'Code review' status to in_progress"
   - "Mark 'Bug fix for login' as done"
   - "Move 'Feature testing' to review"

3. **Team Coordination**:
   - "List all tasks assigned to the development team"
   - "Show me high priority items in todo status"
   - "Search for all deployment related tasks"

## Tips

1. **Natural Language**: Claude understands context, so you can say "Create a task for..." instead of specifying every field
2. **Bulk Operations**: You can ask Claude to "Mark all testing tasks as done" and it will handle multiple items
3. **Smart Filters**: Combine filters like "Show me high priority tasks assigned to me that are overdue"
4. **Context Awareness**: Claude remembers recent operations, so you can say "Change its priority to high" after creating an item

Enjoy using your Action Kanban system through Claude Desktop!