import { ArvoErrorSchema, createArvoOrchestratorContract, type ArvoErrorType } from 'arvo-core';
import {
  createArvoResumable,
  type EventHandlerFactory,
  ExecutionViolation,
  type IMachineMemory,
} from 'arvo-event-handler';
import { z } from 'zod';
import { addContract } from './add.handler.js';
import { greetingContract } from './greeting.handler.js';
import { greetingOrchestratorContract } from './greeting.orchestrator.js';

// Define the contract for the greeting resumable workflow.
// Each orchestrator contract must have a globally unique URI and name.
export const greetingResumableContract = createArvoOrchestratorContract({
  uri: '#/demo/resumable/greeting',
  name: 'greeting.resumable',
  versions: {
    '1.0.0': {
      init: z.object({
        name: z.string(),
        age: z.number(),
        toolUseId$$: z.string().optional(),
      }),
      complete: z.object({
        errors: ArvoErrorSchema.array().min(1).nullable(),
        result: z.string().nullable(),
        sameResultFromWorkflow: z.boolean(),
        toolUseId$$: z.string().optional(),
      }),
    },
  },
});

// ArvoResumable is an imperative orchestrator event handler.
// From an event perspective it behaves like any orchestrator,
// but its workflow logic is defined imperatively.
export const greetingResumable: EventHandlerFactory<{ memory: IMachineMemory<Record<string, unknown>> }> = ({
  memory,
}) =>
  createArvoResumable({
    contracts: {
      self: greetingResumableContract,
      services: {
        greeting: greetingContract.version('1.0.0'),
        adder: addContract.version('1.0.0'),
        greetingOrchestrator: greetingOrchestratorContract.version('1.0.0'),
      },
    },
    memory,
    executionunits: 0,
    types: {
      context: {} as {
        name: string;
        age: number;
        greeting: string | null;
        updatedAge: number | null;
        errors: ArvoErrorType[];
        toolUseId: string | null;
        /**
         * Tracks the process ID (subject) of this orchestration.
         * Required when this resumable delegates work to another orchestrator,
         * ensuring proper context tracking across nested workflows.
         */
        selfSubject$$: string;
      },
    },
    handler: {
      '1.0.0': async ({ input, service, context, collectedEvents }) => {
        /**
         * This getting-started example demonstrates core features of ArvoResumable
         * using simple if/else conditions to decide which events to emit.
         *
         * In real-world scenarios, the same pattern could be powered by an AI agent.
         * For example, an LLM handler could analyze context and dynamically choose
         * which events to raise—turning this into an agentic workflow without
         * changing the underlying orchestration model.
         */
        if (
          service?.type === 'sys.com.calculator.add.error' ||
          service?.type === 'sys.com.greeting.create.error' ||
          service?.type === 'sys.arvo.orc.greeting.error'
        ) {
          // Propagate service errors as system errors for the resumable.
          throw new Error(`Service execution failed: ${service.data.errorMessage}`);
        }

        if (input) {
          if (context) {
            /**
             * Violation: init event received after context was already initialized.
             * This indicates a race condition or event deduplication issue.
             *
             * Violation errors differ from system errors: they are thrown directly,
             * not emitted as events. This gives developers explicit control over
             * error boundaries.
             *
             * The ViolationError category will be covered in more detail in future docs.
             */
            throw new ExecutionViolation(
              '[Critical Error] Init event consumed after context initialization. Possible race condition or deduplication error.',
            );
          }

          return {
            context: {
              name: input.data.name,
              age: input.data.age,
              greeting: null,
              updatedAge: null,
              errors: [],
              toolUseId: input.data.toolUseId$$ ?? null,
              selfSubject$$: input.subject, // Subjects act as workflow IDs; nested orchestrations each have their own subject.
            },
            services: [
              {
                type: 'com.calculator.add' as const,
                data: { numbers: [input.data.age, 7] },
              },
              {
                type: 'com.greeting.create' as const,
                data: { name: input.data.name },
              },
              {
                type: 'arvo.orc.greeting' as const,
                data: {
                  name: input.data.name,
                  age: input.data.age,
                  parentSubject$$: input.subject, // Automatically included in contracts created via createArvoOrchestratorContract.
                },
              },
            ],
          };
        }

        if (!context) {
          // Fatal violation: service event received without initialized context.
          throw new ExecutionViolation(
            '[Critical Error] Service event consumed without context. Possible state persistence issue.',
          );
        }

        // Final aggregation: check if all dependent service results are available.
        if (
          (collectedEvents?.['evt.calculator.add.success']?.length ?? 0) > 0 &&
          (collectedEvents?.['evt.greeting.create.success']?.length ?? 0) > 0 &&
          (collectedEvents?.['arvo.orc.greeting.done']?.length ?? 0) > 0
        ) {
          const orchestratorString = collectedEvents['arvo.orc.greeting.done']?.[0]?.data?.result;
          const lowLevelGeneratedString = `Greeting -> ${collectedEvents['evt.greeting.create.success']?.[0]?.data?.greeting}, Updated Age -> ${collectedEvents['evt.calculator.add.success']?.[0]?.data?.result}`;

          return {
            output: {
              errors: null,
              sameResultFromWorkflow: lowLevelGeneratedString === orchestratorString,
              result: lowLevelGeneratedString,
              toolUseId$$: context.toolUseId ?? undefined,
            },
          };
        }
      },
    },
  });
