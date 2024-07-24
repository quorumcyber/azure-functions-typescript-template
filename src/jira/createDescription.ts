import { type BlockContent, type DocNode } from '@atlaskit/adf-schema';
import * as adf from '@atlaskit/adf-utils/builders';

import { demoAlert, type AzureMonitorCommonAlert } from '../azureAlerts/alertSchmea';
import { fetchAlertData } from '../utils/fetchResults';
import log from '../utils/logHandler';
import { type AlertTypes } from './projects';

//Takes a AzureMonitorCommonAlert object and returns a ADF document to generate Jira Alert
export const generateAlertDescription = async (
  alertData: AzureMonitorCommonAlert,
  alertType: AlertTypes,
): Promise<DocNode> => {
  const alertDescription = adf.doc(
    adf.heading({ level: 1 })(
      adf.text(`${alertType} - ${alertData.data.essentials.alertRule}` || `${alertType} - Security Metrics Alert`),
    ),
    adf.heading({ level: 3 })(adf.text('Severity')),
    adf.paragraph(adf.text(alertData.data.essentials.severity)),
    adf.heading({ level: 3 })(adf.text('Fired At')),
    adf.paragraph(adf.text(alertData.data.essentials.firedDateTime)),
    adf.heading({ level: 3 })(adf.text('Number of Alerts')),
    adf.paragraph(adf.text(`${alertData.data.alertContext.condition.allOf[0]?.metricValue}` || 'Unknown')),

    adf.heading({ level: 2 })(adf.text('Alert details')),
    adf.paragraph(adf.text(alertData.data.essentials.description)),

    adf.heading({ level: 2 })(adf.text('Resources')),
    adf.paragraph(adf.link({ href: alertData.data.essentials.investigationLink })('Investigation Link')),
    adf.paragraph(
      adf.link({ href: alertData.data.alertContext.condition.allOf[0]?.linkToFilteredSearchResultsUI ?? 'Error' })(
        'Filtered Results Link',
      ),
    ),
    adf.heading({ level: 2 })(adf.text('Custom Alert Properties')),
    adf.paragraph(adf.text(JSON.stringify(alertData.data.alertContext.properties))),
    adf.heading({ level: 2 })(adf.text('Alert Results')),
    await results(alertData),
  );
  log({
    message: 'Alert Description Generated',
    level: 'info',
    function: 'generateAlertDescription',
    project: alertType,
    alertName: alertData.data.essentials.alertRule,
  });
  return alertDescription;
};

const results = async (alertData: AzureMonitorCommonAlert) => {
  try {
    if (alertData.data.alertContext.condition.allOf[0]?.linkToFilteredSearchResultsAPI) {
      return (await fetchAlertData(
        alertData.data.alertContext.condition.allOf[0]?.linkToFilteredSearchResultsAPI,
        alertData.data.essentials.alertRule,
      )) as BlockContent;
    } else {
      return adf.paragraph(adf.text('No alert results available'));
    }
  } catch (error) {
    return adf.paragraph(adf.text('Error loading results'));
  }
};

if (require.main === module) {
  const alertBody = generateAlertDescription(demoAlert, 'XDR');
  console.log(alertBody);
}
