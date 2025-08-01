#!/usr/bin/env node

// Test script to verify MCP server functionality
const { spawn } = require('child_process');
const path = require('path');

console.log('Testing Action Kanban MCP Server...\n');

const mcpServer = spawn('node', [path.join(__dirname, 'dist', 'index.js')], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, API_BASE_URL: 'http://localhost:13000' }
});

// Send a list tools request
const listToolsRequest = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
}) + '\n';

console.log('Sending tools/list request...');
mcpServer.stdin.write(listToolsRequest);

// Handle responses
mcpServer.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.log('\nResponse received:');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.result && response.result.tools) {
        console.log('\nAvailable tools:');
        response.result.tools.forEach(tool => {
          console.log(`- ${tool.name}: ${tool.description}`);
        });
      }
    } catch (e) {
      // Ignore non-JSON output
    }
  });
});

mcpServer.stderr.on('data', (data) => {
  console.error('MCP Server Error:', data.toString());
});

// Clean exit after 2 seconds
setTimeout(() => {
  mcpServer.kill();
  process.exit(0);
}, 2000);