import { testArvoDemo } from './execute.test.js';
import { telemetrySdkStart, telemetrySdkStop } from './otel.js';

async function main() {
  telemetrySdkStart();
  await testArvoDemo();
  await telemetrySdkStop();
}

main();
