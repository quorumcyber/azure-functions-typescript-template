import { delay } from "../src/utils";

const invokeDelay = async (): Promise<void> => {
  console.time("delay");
  await delay(1000);
  console.timeEnd("delay")
}

void invokeDelay();