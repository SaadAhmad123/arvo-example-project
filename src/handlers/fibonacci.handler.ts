import { createArvoEventHandler, type EventHandlerFactory } from 'arvo-event-handler';
import { createSimpleArvoContract } from 'arvo-core';
import z from 'zod';

/**
 * Fibonacci sequence generator event handler for computationally intensive
 * operations that are impractical for agents to execute directly.
 *
 * This handler generates Fibonacci series using an iterative algorithm and
 * integrates with the Arvo event-driven architecture, enabling invocation
 * by users, ArvoOrchestrators, ArvoResumables, and Agentic ArvoResumables
 * through the event broker.
 *
 * The toolUseId$$ passthrough field enables participation in agentic workflows
 * by providing the correlation identifier required by LLMs to track tool call
 * execution across the request-response cycle.
 */
export const fibonacciContract = createSimpleArvoContract({
  uri: '#/demo/handler/fibonnaci',
  type: 'fibonacci.series',
  description: 'Generates a fibonacci sequence up to the specified length using an iterative algorithm',
  versions: {
    '1.0.0': {
      accepts: z.object({
        limit: z.number().min(0).max(1000).describe('The maximum length of the fibonacci series to generate'),
        // This is a usefull field when working with AI Agents for tool call correlation
        toolUseId$$: z.string().optional(),
      }),
      emits: z.object({
        series: z.number().array().describe('The generated fibonacci sequence as an array of numbers'),
        // This is a usefull field when working with AI Agents for tool call correlation
        toolUseId$$: z.string().optional(),
      }),
    },
  },
});

export const fibonacciHandler: EventHandlerFactory = () =>
  createArvoEventHandler({
    contract: fibonacciContract,
    executionunits: 0,
    handler: {
      '1.0.0': async ({ event }) => {
        const limit = event.data.limit;

        if (limit <= 0) {
          throw new Error('Limit must be greater than 0');
        }

        const series: number[] = [];

        if (limit >= 1) {
          series.push(0);
        }

        if (limit >= 2) {
          series.push(1);
        }

        for (let i = 2; i < limit; i++) {
          // biome-ignore lint/style/noNonNullAssertion: Sure that these cannot be empty
          const nextNumber = series[i - 1]! + series[i - 2]!;
          series.push(nextNumber);
        }

        return {
          type: 'evt.fibonacci.series.success',
          data: {
            series: series,
            toolUseId$$: event.data.toolUseId$$,
          },
          executionunits: limit * 1e-6,
        };
      },
    },
  });
