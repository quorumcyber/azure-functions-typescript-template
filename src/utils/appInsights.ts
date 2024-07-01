import type { AzureFunction, Context } from '@azure/functions';
import * as appInsights from 'applicationinsights';

import envVariables from '../env';
import { errorResponse } from './misc';

const setupApplicationInsights = (context: Context) => {
  // grab connection string from local settings
  const connectionString = envVariables.APPLICATIONINSIGHTS_CONNECTION_STRING;
  const { functionName, invocationId } = context.executionContext;

  // setup application insights
  appInsights
    .setup(connectionString)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setSendLiveMetrics(false)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(false, false);

  // deconstruct tags and keys to make it easier to define cloud role and operation name
  const appInsightsTags = appInsights.defaultClient.context.tags;
  const appInsightsKeys = appInsights.defaultClient.context.keys;
  const appInsightsProperties = appInsights.defaultClient.commonProperties;
  appInsightsTags[appInsightsKeys.cloudRole] = envVariables.CloudRole;
  appInsightsTags[appInsightsKeys.operationName] = functionName;
  appInsightsProperties.invocationId = invocationId;

  appInsights.start();
};

export const withAppInsights = async <T>(
  context: Context,
  req: T,
  mainFunction: AzureFunction,
  useAppInsights = false,
) => {
  // setup app insights
  if (useAppInsights) setupApplicationInsights(context);

  // run secondary function that was passed through wrapper
  try {
    // eslint-disable-next-line
    const result = await mainFunction(context, req);
    // eslint-disable-next-line
    return result;
  } catch (error) {
    context.log.error(error);
    return errorResponse(error);
  }
};
