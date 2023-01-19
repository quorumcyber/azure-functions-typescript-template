import type { AzureFunction, Context, HttpRequest, HttpResponse } from "@azure/functions";
import { delay } from "../src/utils";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<HttpResponse> {
  context.log("Hello from http!");

  await delay(1000);

  return {
    body: `Hello World! Sent via a ${req.method || "Unknown"} request to ${req.url}`,
  };
};

export default httpTrigger;
