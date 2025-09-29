import { createArvoEventFactory } from 'arvo-core';
import { execute } from './execute.js';
import { findDomainMcpAgent } from './handlers/agent.mcp.findadomain.js';
import { calculatorAgent } from './handlers/agent.calculator.js';
import { webInfoAgent } from './handlers/agent.webinfo.js';

export const testFindDomainMcpAgent = async () => {
  console.log('Testing Find A Domain MCP Agent');
  const event = createArvoEventFactory(findDomainMcpAgent.contract.version('1.0.0')).accepts({
    source: 'test.test.test',
    data: {
      message:
        'I want to register the domain http://arvo.land. If that is taken can you give me similar domains that are open?',
    },
  });
  await execute(event).then((e) => console.log(e));
};

export const testCalculatorAgent = async () => {
  console.log('Testing Calculator Agent');
  const event = createArvoEventFactory(calculatorAgent.contract.version('1.0.0')).accepts({
    source: 'test.test.test',
    data: {
      parentSubject$$: null,
      message: 'What can you do?',
    },
  });
  await execute(event).then((e) => console.log(e));
};

export const testWebInfoAgent = async () => {
  console.log('Testing Web Info Agent');
  const event = createArvoEventFactory(webInfoAgent.contract.version('1.0.0')).accepts({
    source: 'test.test.test',
    data: {
      parentSubject$$: null,
      message:
        'Can I register arvo.land domain? Also based on the Astro docs give me a summary of Astro with references',
    },
  });
  await execute(event).then((e) => console.log(e));
};

// This is just a sample script to do a quick test.
// Actual tests should be done via actual Typescript
// testing frameworks like jest
export const testArvoDemo = async () => {
  try {
    await testFindDomainMcpAgent();
    await testCalculatorAgent();
    await testWebInfoAgent();
  } catch (e) {
    console.log(e);
  }
};
