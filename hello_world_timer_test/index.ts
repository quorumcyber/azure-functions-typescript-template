import { type HttpResponseInit, type InvocationContext, type Timer } from '@azure/functions';

import { delay } from '../src/utils/misc';

const timerTrigger = async (context: InvocationContext, timer: Timer): Promise<HttpResponseInit> => {
  context.log('Hello from timer!');

  await delay(1000);

  return {
    body: `Hello World! Timer trigger will next trigger at ${timer.scheduleStatus.next || 'Unknown'}`,
  };
};

export default timerTrigger;
