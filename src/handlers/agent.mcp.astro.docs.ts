import { createMcpAgent } from '../agentFactory/createMcpAgent.js';
import { MCPClient } from '../agentFactory/integrations/MCPClient.js';
import { openaiLLMCaller } from '../agentFactory/integrations/openai.js';

/**
 * MCP agent implementation that establishes connectivity with an MCP
 * server functioning as a knowledge base for the agent.
 *
 * The agent processes input event messages, formulates an optimal
 * execution plan, and invokes the connected MCP tools to generate
 * appropriate responses.
 *
 * This implementation demonstrates how the MCP Agent Arvo Event Handler
 * can integrate with arbitrary MCP servers through the MCP Client interface.
 */
export const astroDocsMcpAgent = createMcpAgent({
  name: 'astro.docs',
  description: 'This agent enables you to find and search correct information from Astro docs',
  mcpClient: new MCPClient('https://mcp.docs.astro.build/mcp'),
  agenticLLMCaller: openaiLLMCaller,
});
