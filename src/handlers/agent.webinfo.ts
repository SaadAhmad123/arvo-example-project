import { createAgenticResumable } from '../agentFactory/createAgenticResumable.js';
import { anthropicLLMCaller } from '../agentFactory/integrations/anthropic.js';
import type { CallAgenticLLM } from '../agentFactory/types.js';
import { astroDocsMcpAgent } from './agent.mcp.astro.docs.js';
import { findDomainMcpAgent } from './agent.mcp.findadomain.js';

/**
 * Web Information Agent implementation that demonstrates inter-agent
 * communication patterns within the system.
 *
 * This Agentic Resumable demonstrates the utilization of a unified configuration approach for
 * connecting with other agents, maintaining consistent integration patterns
 * whether interfacing with ArvoOrchestrators, ArvoResumables, ArvoEventHandlers or Arvo Agents.
 */
export const webInfoAgent = createAgenticResumable({
  name: 'web.info',
  description: 'This agent can answer queries related to domain search/finding and astro docs',
  systemPrompt: () =>
    'Make a plan and then execute it. Take into account the available tool while planning and executing',
  services: {
    astroDocAgent: astroDocsMcpAgent.contract.version('1.0.0'),
    findDomainAgent: findDomainMcpAgent.contract.version('1.0.0'),
  },
  agenticLLMCaller: anthropicLLMCaller as CallAgenticLLM,
});
