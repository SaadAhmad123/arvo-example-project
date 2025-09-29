import { createAgenticResumable } from '../agentFactory/createAgenticResumable.js';
import { openaiLLMCaller } from '../agentFactory/integrations/openai.js';
import type { CallAgenticLLM } from '../agentFactory/types.js';
import { calculatorContract } from './calculator.handler.js';

export const calculatorAgent = createAgenticResumable({
  name: 'calculator',
  description: 'This Agent can perform calculations based on the tools available to it.',
  services: { calculatorHandler: calculatorContract.version('1.0.0') },
  maxToolInteractions: 100,
  systemPrompt: () =>
    'If, based on the available tools you cannot perform the calculation then just tell me tha you cannot perform it and give me a terse reasoning',
  agenticLLMCaller: openaiLLMCaller as CallAgenticLLM,
});
