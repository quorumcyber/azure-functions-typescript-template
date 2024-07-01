import { type HttpResponse } from '@azure/functions';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const errorResponse = (error: unknown, fullError = false): HttpResponse => {
  if (error instanceof Error && !fullError) {
    return { status: 500, body: error.message || String(error) };
  }
  return { status: 500, body: error };
};
