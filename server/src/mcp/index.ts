import 'dotenv/config';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { PatientSearchParamsSchema } from '../schemas/patientSearch.js';
import { searchPatients } from '../services/epicFhir.js';

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

server.registerTool(
  'search_patients',
  {
    description: 'Search for patients in Epic using FHIR search parameters.',
    inputSchema: PatientSearchParamsSchema,
  },
  async (params) => {
    const bundle = await searchPatients(params);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(bundle),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();

await server.connect(transport);
