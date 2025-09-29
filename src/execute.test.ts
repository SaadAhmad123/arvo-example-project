import { createArvoEventFactory } from 'arvo-core';
import { addContract } from './handlers/add.handler.js';
import { greetingContract } from './handlers/greeting.handler.js';
import { greetingOrchestratorContract } from './handlers/greeting.orchestrator.js';
import { greetingResumableContract } from './handlers/greeting.resumable.js';
import { execute } from './execute.js';
import { findDomainMcpAgent } from './handlers/agent.mcp.findadomain.js';
import { calculatorAgent } from './handlers/agent.calculator.js';
import { webInfoAgent } from './handlers/agent.webinfo.js';

export const testGreetingHandler = async () => {
  console.log('Testing greeting handler');
  const event = createArvoEventFactory(greetingContract.version('1.0.0')).accepts({
    source: 'test.test.test',
    data: {
      name: 'John Doe',
    },
  });
  // Event flow: 'com.greeting.create' -> greetingHandler -> evt.greeting.create.success
  await execute(event).then((e) => console.log(e));
};

export const testAddHandler = async () => {
  console.log('Testing add handler');
  const event = createArvoEventFactory(addContract.version('1.0.0')).accepts({
    source: 'test.test.test',
    data: {
      numbers: [2, 3, 4],
    },
  });

  // Event flow: 'com.calculator.add' -> addHandler -> evt.calculator.add.success
  await execute(event).then((e) => console.log(e));
};

export const testGreetingOrchestrator = async () => {
  console.log('Testing greeting orchestrator');
  const event = createArvoEventFactory(greetingOrchestratorContract.version('1.0.0')).accepts({
    source: 'test.test.test',
    data: {
      /**
       * A field specific to orchestrators and resumables to identify the parent
       * process id (subject). This enable context stitching for nested orchestrations.
       * A 'null' value means that this is the root orchestration and for 99.99% of the
       * cases developer will be marking it as 'null'.
       */
      parentSubject$$: null,
      name: 'John Doe',
      age: 45,
    },
  });

  // Event flow: 'arvo.orc.greeting' -> greetingOrchestrator(greetingMachineV100) -> 'com.greeting.create', 'com.calculator.add' -> Concurrently [greetingHandler, addHandler] <This is dues to single threaded nature of NodeJS>  -> 'evt.calculator.add.success', 'evt.greeting.create.success' -> greetingOrchestrator -> 'arvo.orc.greeting.done'
  await execute(event).then((e) => console.log(e));
};

export const testGreetingResumable = async () => {
  console.log('Testing greeting orchestrator');
  const event = createArvoEventFactory(greetingResumableContract.version('1.0.0')).accepts({
    source: 'test.test.test',
    data: {
      /**
       * A field specific to orchestrators and resumables to identify the parent
       * process id (subject). This enable context stitching for nested orchestrations.
       * A 'null' value means that this is the root orchestration and for 99.99% of the
       * cases developer will be marking it as 'null'.
       */
      parentSubject$$: null,
      name: 'John Doe',
      age: 45,
    },
  });

  // Event flow: 'arvo.orc.greeting.resumable' -> greetingOrchestrator(greetingMachineV100) -> 'com.greeting.create', 'com.calculator.add', 'arvo.orc.greeting' -> Concurrently [greetingHandler, addHandler] <This is dues to single threaded nature of NodeJS>  -> 'evt.calculator.add.success', 'evt.greeting.create.success' -> greetingOrchestrator -> 'arvo.orc.greeting.resumable.done'
  await execute(event).then((e) => console.log(e));
};

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
      message:
        'I want to you add the 3 to 34,5,6,7,8,8,9,10,11. But I want you to do it one by one. e.g. first 3 + 34 get the result then call 3 + 5 get the result then so on...',
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
    // await testAddHandler();
    // await testGreetingHandler();
    // await testGreetingOrchestrator();
    // await testGreetingResumable();
    // await testFindDomainMcpAgent();
    await testCalculatorAgent();
    // await testWebInfoAgent();
  } catch (e) {
    console.log(e);
  }
};
