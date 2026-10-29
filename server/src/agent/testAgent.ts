import 'dotenv/config';
import { connectMcp } from '../mcp/client.js';
import { runAgent } from './index.js';

const client = await connectMcp();

try {
  const results = await runAgent('Find Warren McGinnis, born May 24, 1952.', client);
  console.dir(results, { depth: null });
} finally {
  await client.close();
}
