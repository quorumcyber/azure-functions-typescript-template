import type { AzureFunction, Context, Timer, HttpResponse } from "@azure/functions";
import { delay } from "../src/utils";

const timerTrigger: AzureFunction = async (context: Context, timer: Timer): Promise<HttpResponse> => {
  context.log("Hello from timer!");

  await delay(1000);

  return {
    body: `Hello World! Timer trigger will next trigger at ${timer.scheduleStatus.next || "Unknown"}`,
  };
};

export default timerTrigger;
