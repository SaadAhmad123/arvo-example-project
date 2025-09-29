import z from 'zod';
import { createAgenticResumable } from '../agentFactory/createAgenticResumable.js';
import { openaiLLMCaller } from '../agentFactory/integrations/openai.js';
import type { CallAgenticLLM } from '../agentFactory/types.js';
import { calculatorContract } from './calculator.handler.js';
import { fibonacciContract } from './fibonacci.handler.js';

/**
 * Calculator agent implementation that processes natural language input
 * and executes mathematical operations when feasible.
 *
 * This handler demonstrates the Agentic Resumable pattern's capability
 * to interface with arbitrary Arvo Event Handlers and orchestrate their
 * operations through a unified agentic interface.
 */
export const calculatorAgent = createAgenticResumable({
  name: 'calculator',
  description: 'This Agent can perform calculations based on the tools available to it.',
  services: {
    calculatorHandler: calculatorContract.version('1.0.0'),
    fibonnaciHandler: fibonacciContract.version('1.0.0'),
  },
  maxToolInteractions: 100,
  outputFormat: z.object({
    response: z
      .string()
      .describe(
        'The final answer of the query. It must be a string. You can stringify the number. If no response is available then the response is NaN (Not a number)',
      ),
    details: z.string().describe('The detailed answer to the query'),
  }),
  systemPrompt: () =>
    'If, based on the available tools you cannot perform the calculation then just tell me tha you cannot perform it and give me a terse reasoning',
  agenticLLMCaller: openaiLLMCaller as CallAgenticLLM,
});
