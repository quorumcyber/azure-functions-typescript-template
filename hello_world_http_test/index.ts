import { type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';

import { delay } from '../src/utils/misc';

const httpTrigger = async function (context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  context.log('Hello from http!');

  await delay(1000);

  return {
    body: `Hello World! Sent via a ${req.method || 'Unknown'} request to ${req.url}`,
  };
};

export default httpTrigger;
