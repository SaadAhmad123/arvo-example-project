import z from 'zod';
import { createMcpAgent } from '../agentFactory/createMcpAgent.js';
import { anthropicLLMCaller } from '../agentFactory/integrations/anthropic.js';
import { MCPClient } from '../agentFactory/integrations/MCPClient.js';

/**
 * Domain information agent that interfaces with the Find A Domain
 * remote MCP server to retrieve domain-related data.
 *
 * This implementation demonstrates the agent's capability to return
 * responses in any structured format specified in its configuration,
 * providing flexibility in output schema definition.
 */
export const findDomainMcpAgent = createMcpAgent({
  name: 'findadomina',
  description:
    'An agent which can help find a domain. Ask it what it can do to figure out it capabilitie which you can then use.',
  outputFormat: z.object({
    response: z.string().describe('The short response to the query'),
    details: z.string().describe('The detailed response of the query'),
  }),
  mcpClient: new MCPClient('https://api.findadomain.dev/mcp'),
  agenticLLMCaller: anthropicLLMCaller,
});
