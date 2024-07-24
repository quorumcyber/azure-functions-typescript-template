import { type Context, type HttpRequest, type HttpResponse } from '@azure/functions';

import { azureMonitorCommonAlertSchema } from '../src/azureAlerts/alertSchmea';
import { generateAlertDescription } from '../src/jira/createDescription';
import { createIssue } from '../src/jira/createIssue';
import { createIssueBody } from '../src/jira/createIssueBody';
import { projects } from '../src/jira/projects';
import { withAppInsights } from '../src/utils/appInsights';
import log from '../src/utils/logHandler';

const httpTrigger = async (context: Context, req: HttpRequest): Promise<HttpResponse> => {
  context.log('Hello from http!');

  const alertData = azureMonitorCommonAlertSchema.safeParse(req.body);

  if (!alertData.success) {
    log({
      message: 'Invalid Alert Data',
      level: 'error',
      function: 'httpTrigger',
      project: 'Unknown',
    });
    console.log(alertData.error);
    return { status: 400, body: 'Invalid Alert Data' };
  }

  const project = projects.find((p) => p.alertTypes === req.params.project); //if fails, it will return undefined
  if (!project) {
    log({
      message: 'Invalid Project Name',
      level: 'error',
      function: 'httpTrigger',
      project: 'Unknown',
    });
    return { status: 400, body: 'Invalid Project Key' };
  }

  try {
    const alertBody = await generateAlertDescription(alertData.data, project.alertTypes);
    const issueBody = createIssueBody(alertBody, project, alertData.data);
    await createIssue(issueBody);
    return { status: 200, body: 'Alert Processed' };
  } catch (error) {
    log({
      message: 'Error creating issue',
      level: 'error',
      function: 'httpTrigger',
      project: project.name,
    });
    return { status: 500, body: 'Error' };
  }
};

export default (context: Context, req: HttpRequest) => withAppInsights(context, req, httpTrigger);
