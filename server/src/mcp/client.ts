import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export async function connectMcp(): Promise<Client> {
  const client = new Client({
    name: 'healthcare-agent',
    version: '1.0.0',
  });

  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['tsx', 'src/mcp/server.ts'],
  });

  await client.connect(transport);

  return client;
}
