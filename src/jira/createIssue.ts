import JiraApi from 'jira-client';

import { demoAlert } from '../azureAlerts/alertSchmea';
import envVariables from '../env';
import log from '../utils/logHandler';
import { generateAlertDescription } from './createDescription';
import { createIssueBody } from './createIssueBody';
import { projects } from './projects';

export const jira = new JiraApi({
  protocol: 'https',
  host: envVariables.JiraUrl,
  username: envVariables.JiraUsername,
  password: envVariables.JiraToken,
  apiVersion: '3',
  strictSSL: true,
});

export type IssueType = {
  fields: {
    project: {
      id: string;
    };
    summary: string;
  };
} & JiraApi.IssueObject;

export type IssueResponse = {
  id?: string;
  key?: string;
  self?: string;
} & JiraApi.JsonResponse;

export const createIssue = async (issue: IssueType) => {
  try {
    console.log(`Creating issue in JIRA: ${issue.fields.summary} - ${issue.fields.project.id}`);
    log({
      message: 'Creating issue in JIRA:',
      level: 'info',
      function: 'createIssue',
      project: issue.fields.project.id,
      alertName: issue.fields.summary,
    });
    const response: IssueResponse = await jira.addNewIssue(issue);
    log({
      message: `Issue created in JIRA: ${JSON.stringify(response)} - ${issue.fields.summary}`,
      level: 'info',
      function: 'createIssue',
      project: issue.fields.project.id,
      alertName: issue.fields.summary,
      issueKey: response.key ?? '',
    });
    return response;
  } catch (error) {
    log({
      message: `Error creating issue in JIRA ${JSON.stringify(error)} - ${issue.fields.summary}`,
      level: 'error',
      function: 'createIssue',
      project: issue.fields.project.id,
      alertName: issue.fields.summary,
    });
    return error;
  }
};

//Local Testing Function
if (require.main === module) {
  const project = projects.find((project) => project.name === 'SMI');
  if (!project) {
    throw new Error('Project not found');
  }
  const issueFunction = async () => {
    const alertBody = await generateAlertDescription(demoAlert, project.alertTypes);
    const issueBody = createIssueBody(alertBody, project, demoAlert);
    console.log(JSON.stringify(issueBody.fields.description));
    console.log(await jira.addNewIssue(issueBody));
    // await createIssue(issueBody);
  };
  issueFunction().catch((error) => {
    console.error(`Error creating issue: ${error}`);
  });
}
