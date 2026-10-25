import 'dotenv/config';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic();

const client = new Client({
  name: 'healthcare-agent',
  version: '1.0.0',
});

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['tsx', 'src/mcp/index.ts'],
});
await client.connect(transport);
const result = await client.listTools();

// console.dir(result, { depth: null });

const claudeTools = result.tools.map(({ name, description, inputSchema }) => ({
  name,
  description: description ?? '',
  input_schema: {
    ...inputSchema,
    required: inputSchema.required ?? [],
  },
}));
await client.close();

const response = await anthropic.messages.create({
  model: 'claude-sonnet-5-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Find Warren McGinnis, born May 24, 1952.' }],
  tools: claudeTools,
});

console.dir(response.content, { depth: null });
