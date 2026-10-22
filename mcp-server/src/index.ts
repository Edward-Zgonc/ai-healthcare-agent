import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'healthcare-mcp-server',
  version: '1.0.0',
});

server.registerTool(
  'hello',
  {
    description: 'Returns a greeting.',
  },
  async () => ({
    content: [
      {
        type: 'text',
        text: 'Hello from the healthcare MCP server!',
      },
    ],
  })
);

const transport = new StdioServerTransport();

await server.connect(transport);
