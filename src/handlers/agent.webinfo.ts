import { createAgenticResumable } from '../agentFactory/createAgenticResumable.js';
import { anthropicLLMCaller } from '../agentFactory/integrations/anthropic.js';
import type { CallAgenticLLM } from '../agentFactory/types.js';
import { astroDocsMcpAgent } from './agent.mcp.astro.docs.js';
import { findDomainMcpAgent } from './agent.mcp.findadomain.js';

export const webInfoAgent = createAgenticResumable({
  name: 'web.info',
  description: 'This agent can answer queries related to domain search/finding and astro docs',
  services: {
    astroDocAgent: astroDocsMcpAgent.contract.version('1.0.0'),
    findDomainAgent: findDomainMcpAgent.contract.version('1.0.0'),
  },
  agenticLLMCaller: anthropicLLMCaller as CallAgenticLLM,
});
