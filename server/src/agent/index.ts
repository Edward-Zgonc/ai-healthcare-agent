import Anthropic from '@anthropic-ai/sdk';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

const anthropic = new Anthropic();

export async function runAgent(message: string, client: Client): Promise<string> {
  const { tools } = await client.listTools();

  const claudeTools = tools.map(({ name, description, inputSchema }) => ({
    name,
    description: description ?? '',
    input_schema: {
      ...inputSchema,
      required: inputSchema.required ?? [],
    },
  }));

  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: message }];

  const maxRounds = 5;

  for (let round = 0; round < maxRounds; round++) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5-5',
      max_tokens: 1024,
      messages,
      tools: claudeTools,
    });

    if (response.stop_reason === 'end_turn') {
      // console.dir(response.content, { depth: null });
      return response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n');
    }

    if (response.stop_reason !== 'tool_use') {
      throw new Error(`Unexpected Claude stop reason: ${response.stop_reason}`);
    }

    const toolCalls = response.content.filter((block) => block.type === 'tool_use');

    const toolResults = await Promise.all(
      toolCalls.map(async ({ id, name, input }) => {
        try {
          const result = await client.callTool({
            name,
            arguments: input as Record<string, unknown>,
          });

          const content = Array.isArray(result.content)
            ? result.content
                .filter((block) => block.type === 'text')
                .map((block) => block.text)
                .join('\n')
            : 'Tool returned no text content.';

          return {
            type: 'tool_result' as const,
            tool_use_id: id,
            content,
            is_error: result.isError === true,
          };
        } catch (error) {
          console.error(`Tool execution failed: ${name}`, error);

          return {
            type: 'tool_result' as const,
            tool_use_id: id,
            content: 'Tool execution failed.',
            is_error: true,
          };
        }
      })
    );

    messages.push(
      { role: 'assistant', content: response.content },
      { role: 'user', content: toolResults }
    );
  }

  throw new Error(`Agent exceeded maximum of ${maxRounds} rounds.`);
}
