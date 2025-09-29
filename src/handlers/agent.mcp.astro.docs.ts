import { createMcpAgent } from '../agentFactory/createMcpAgent.js';
import { MCPClient } from '../agentFactory/integrations/MCPClient.js';
import { openaiLLMCaller } from '../agentFactory/integrations/openai.js';

export const astroDocsMcpAgent = createMcpAgent({
  name: 'astro.docs',
  description: 'This agent enables you to find and search correct information from Astro docs',
  mcpClient: new MCPClient('https://mcp.docs.astro.build/mcp'),
  agenticLLMCaller: openaiLLMCaller,
});
