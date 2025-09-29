import type { ArvoEvent } from 'arvo-core';
import { createSimpleEventBroker, SimpleMachineMemory } from 'arvo-event-handler';
import { findDomainMcpAgent } from './handlers/agent.mcp.findadomain.js';
import { calculatorAgent } from './handlers/agent.calculator.js';
import { calculatorHandler } from './handlers/calculator.handler.js';
import { webInfoAgent } from './handlers/agent.webinfo.js';
import { astroDocsMcpAgent } from './handlers/agent.mcp.astro.docs.js';
import { fibonacciHandler } from './handlers/fibonacci.handler.js';

export const execute = async (event: ArvoEvent): Promise<ArvoEvent | null> => {
  /**
   * An in-memory key-value pair which following IMachineMemory interface. The
   * orchestrators and resumables use it to store their state in this memory.
   */
  const memory = new SimpleMachineMemory();
  /**
   * Creates an in-memory event broker that automatically routes events to registered handlers.
   *
   * The broker uses event routing based on the 'event.to' field matching the handler's 'handler.source' field.
   * The 'resolve' function processes the event through the appropriate handler and returns
   * the final result after all event processing is complete.
   *
   * This pattern enables event brokering without requiring external message brokers and is helpful
   * for rapid development, limited-scoped projects, and testing
   */
  const { resolve } = createSimpleEventBroker([
    calculatorHandler(),
    findDomainMcpAgent.handlerFactory(),
    calculatorAgent.handlerFactory({ memory }),
    astroDocsMcpAgent.handlerFactory(),
    webInfoAgent.handlerFactory({ memory }),
    fibonacciHandler(),
  ]);
  return await resolve(event);
};
