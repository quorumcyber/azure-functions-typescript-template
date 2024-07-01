import { type DocNode } from '@atlaskit/adf-schema';

import { demoAlert, type AzureMonitorCommonAlert } from '../azureAlerts/alertSchmea';
import log from '../utils/logHandler';
import { generateAlertDescription } from './createDescription';
import { projects, type ProjectConfigType } from './projects';

export const createIssueBody = (issueBody: DocNode, project: ProjectConfigType, alertData: AzureMonitorCommonAlert) => {
  const body = {
    fields: {
      project: {
        id: `${project.projectId}`,
      },
      summary: `${project.name} - ${alertData.data.essentials.alertRule} - ${alertData.data.essentials.firedDateTime}`,
      description: issueBody,
      issuetype: {
        id: project.issueTypeId,
      },
    },
  };
  log({
    message: 'Issue Body Generated',
    level: 'info',
    function: 'createIssueBody',
    project: project.name,
    alertName: alertData.data.essentials.alertRule,
  });
  return body;
};

if (require.main === module) {
  const project = projects.find((project) => project.name === 'SMI');
  if (!project) {
    throw new Error('Project not found');
  }
  const runTest = async () => {
    const alertBody = await generateAlertDescription(demoAlert, project.alertTypes);
    console.log(createIssueBody(alertBody, project, demoAlert));
  };
  runTest().catch((e) => {
    console.error(e);
  });
}
