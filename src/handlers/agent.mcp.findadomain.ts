import { createMcpAgent } from '../agentFactory/createMcpAgent.js';
import { anthropicLLMCaller } from '../agentFactory/integrations/anthropic.js';
import { MCPClient } from '../agentFactory/integrations/MCPClient.js';

export const findDomainMcpAgent = createMcpAgent({
  name: 'findadomina',
  description:
    'An agent which can help find a domain. Ask it what it can do to figure out it capabilitie which you can then use.',
  mcpClient: new MCPClient('https://api.findadomain.dev/mcp'),
  agenticLLMCaller: anthropicLLMCaller,
});
