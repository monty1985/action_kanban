# MCP Server Configuration

## Running with Docker

When the backend API is running in Docker, the MCP server needs to connect to it properly.

### Option 1: Run MCP Server on Host (Recommended)

The MCP server runs on your host machine and connects to the containerized API:

```json
{
  "mcpServers": {
    "action-kanban": {
      "command": "node",
      "args": ["/path/to/action_kanban/mcp-server/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

### Option 2: Run MCP Server in Docker (Advanced)

If you want to run the MCP server in Docker, you would need to:
1. Create a Dockerfile for the MCP server
2. Configure Claude Desktop to connect to the containerized MCP server
3. Ensure proper networking between containers

For most use cases, Option 1 is simpler and recommended.