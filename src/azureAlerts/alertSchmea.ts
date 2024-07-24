import { z } from 'zod';

export type AzureMonitorCommonAlert = z.infer<typeof azureMonitorCommonAlertSchema>;

export const azureMonitorCommonAlertSchema = z.object({
  schemaId: z.string(),
  data: z.object({
    essentials: z.object({
      alertId: z.string(),
      alertRule: z.string(),
      severity: z.string(),
      signalType: z.string(),
      monitorCondition: z.string(),
      monitoringService: z.string(),
      alertTargetIDs: z.array(z.string()),
      configurationItems: z.array(z.string()),
      originAlertId: z.string(),
      firedDateTime: z.string(),
      description: z.string(),
      essentialsVersion: z.string(),
      alertContextVersion: z.string(),
      investigationLink: z.string(),
    }),
    alertContext: z.object({
      properties: z.object({
        TestProperty: z.string(),
      }),
      conditionType: z.string(),
      condition: z.object({
        windowSize: z.string(),
        allOf: z.array(
          z.object({
            searchQuery: z.string(),
            metricMeasureColumn: z.null(),
            targetResourceTypes: z.string(),
            operator: z.string(),
            threshold: z.string(),
            timeAggregation: z.string(),
            dimensions: z.array(z.any()),
            metricValue: z.number(),
            failingPeriods: z.object({
              numberOfEvaluationPeriods: z.number(),
              minFailingPeriodsToAlert: z.number(),
            }),
            linkToSearchResultsUI: z.string(),
            linkToFilteredSearchResultsUI: z.string(),
            linkToSearchResultsAPI: z.string(),
            linkToFilteredSearchResultsAPI: z.string(),
            event: z.null(),
          }),
        ),
        windowStartTime: z.string(),
        windowEndTime: z.string(),
      }),
    }),
    customProperties: z.object({}).passthrough(),
  }),
});

export const demoAlert: AzureMonitorCommonAlert = {
  schemaId: 'azureMonitorCommonAlertSchema',
  data: {
    essentials: {
      alertId:
        '/subscriptions/ad6a013f-0516-411f-86ab-daa0de92f672/providers/Microsoft.AlertsManagement/alerts/260c6585-f7d3-2d6a-eadd-acd574890017',
      alertRule: 'XDR Alert trend change',
      severity: 'Sev2',
      signalType: 'Log',
      monitorCondition: 'Fired',
      monitoringService: 'Log Alerts V2',
      alertTargetIDs: [
        '/subscriptions/ad6a013f-0516-411f-86ab-daa0de92f672/resourcegroups/prod-security-metrics-rg/providers/microsoft.operationalinsights/workspaces/prod-security-metrics-la',
      ],
      configurationItems: [
        '/subscriptions/ad6a013f-0516-411f-86ab-daa0de92f672/resourcegroups/prod-security-metrics-rg/providers/microsoft.operationalinsights/workspaces/prod-security-metrics-la',
      ],
      originAlertId: '59d9d3f1-25ad-484b-b243-207e165ca67f',
      firedDateTime: '2024-06-24T15:56:02.5080114Z',
      description: 'This is the desciption field :) ',
      essentialsVersion: '1.0',
      alertContextVersion: '1.0',
      investigationLink:
        'https://portal.azure.com/#view/Microsoft_Azure_Monitoring_Alerts/Investigation.ReactView/alertId/%2fsubscriptions%2fad6a013f-0516-411f-86ab-daa0de92f672%2fresourceGroups%2fprod-security-metrics-rg%2fproviders%2fMicrosoft.AlertsManagement%2falerts%2f260c6585-f7d3-2d6a-eadd-acd574890017',
    },
    alertContext: {
      properties: {
        TestProperty: 'Jacob',
      },
      conditionType: 'LogQueryCriteria',
      condition: {
        windowSize: 'P1D',
        allOf: [
          {
            searchQuery:
              "// Set thresholds\nlet minAlerts = 25; // Regarless of the percentage change, don't alert if daily alerts are under this threshold\nlet minChange = 30; // Percentage change to alert on\n// Get customers that should not alert on\nlet exclusions = MXDR_Exclusions();\n// Get alerts today\nlet alerts_24h = QC_SMI_Alerts_CL\n    | where TimeGenerated > ago(1d)\n    | summarize count() by customerCode_s\n    | project customerCode_s, alertsToday = count_;\n// Get alerts last 30 days\nlet alerts_30d = QC_SMI_Alerts_CL\n    | where TimeGenerated > ago(30d)\n    | summarize count() by customerCode_s\n    | project customerCode_s, alertsThisMonth = count_, averageThisMonth = round(count_ / 30.00, 2);\n// Calculate statistics\nlet alert_statistics = alerts_24h\n    | join kind=inner alerts_30d on customerCode_s\n    | where not (customerCode_s has_any(exclusions))\n    | project customerCode = customerCode_s, alertsToday, alertsThisMonth, averageThisMonth, change = (alertsToday - averageThisMonth) * 100;\n// Calculate change percentage\nlet change_monitor = alert_statistics\n    | project customerCode, alertsToday, alertsThisMonth, averageThisMonth, percentageChange = round(change / averageThisMonth, 2);\n// Alert con change\nchange_monitor\n    | where percentageChange > minChange //and alertsToday > minAlerts\n\n",
            metricMeasureColumn: null,
            targetResourceTypes: "['microsoft.operationalinsights/workspaces']",
            operator: 'GreaterThan',
            threshold: '0',
            timeAggregation: 'Count',
            dimensions: [],
            metricValue: 1,
            failingPeriods: {
              numberOfEvaluationPeriods: 1,
              minFailingPeriodsToAlert: 1,
            },
            linkToSearchResultsUI:
              'https://portal.azure.com#@4bd2cd73-7c32-48aa-8a02-646c8bc0d343/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/source/Alerts.EmailLinks/scope/%7B%22resources%22%3A%5B%7B%22resourceId%22%3A%22%2Fsubscriptions%2Fad6a013f-0516-411f-86ab-daa0de92f672%2Fresourcegroups%2Fprod-security-metrics-rg%2Fproviders%2Fmicrosoft.operationalinsights%2Fworkspaces%2Fprod-security-metrics-la%22%7D%5D%7D/q/eJy1VN9v0zAQfu9fcW8kqCVp1iJtUyehgCYkKsHWB8SLZeJb4%2BHYk%2B0AQfzxXOK0SdttEhLkKb4f39333dlJArfowZcWXWmUcBNFx0rqNwqtd7CCbHkJSQI3uOVWoXNg7igc4QFtgdrzLUJRcr3FKQijX3jgbSbIOxBcqiYcHXCLUGuBlpKlGwru6uUdBtU7S7t6H4%2FhwZse2ugJBVxTXlE7byq0LR73QIC1EqCNHyJbePxZqNpJo1s%2B689vb9i7vSWKL3dofafeCN50ecHAskVJeZ9ydrt%2Bz4IuLP8wAfp%2Bw48SidlGVniNGi33KOAKIkE%2FnoxRlmaLWfp6li028%2BXFMrtYnr9Kw%2FclhhnMRdwjubqquJW%2FiLCptY9i%2BNrsGeZGIHN95IM191j4I%2Be073fT9k8NdyjsmJ3izpPGNJzGjUmepeL%2FkSTwf86StmhttC%2F3TMnznXrb4thlySWiEAAJNUJ9TSELQ8%2B5KmpFJMB57qXzshhpwgYjAQ270Ld3b6SGb1KLldSkyVhHox9nFGRs1zM69EPJHeO6iYZNjeNnZGg5Pz37E4lOlZnuLtUKovHWzE4iY3gJ8zQ90qvPHt6ATrZgZZXR0hu7E22k4zOU%2Fp7BUHz%2FdvTTDsfkkZx%2B8N1%2B09rQnLrYyWHnB%2BM6KXM1eq6ShGtxcO86b7g%2FfwA%3D/prettify/1/timespan/2024-06-22T15%3a52%3a59.0000000Z%2f2024-06-24T15%3a52%3a59.0000000Z',
            linkToFilteredSearchResultsUI:
              'https://portal.azure.com#@4bd2cd73-7c32-48aa-8a02-646c8bc0d343/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/source/Alerts.EmailLinks/scope/%7B%22resources%22%3A%5B%7B%22resourceId%22%3A%22%2Fsubscriptions%2Fad6a013f-0516-411f-86ab-daa0de92f672%2Fresourcegroups%2Fprod-security-metrics-rg%2Fproviders%2Fmicrosoft.operationalinsights%2Fworkspaces%2Fprod-security-metrics-la%22%7D%5D%7D/q/eJy1VN9v0zAQfu9fcW8kqCVp1iJtUyehgCYkKsHWB8SLZeJb4%2BHYk%2B0AQfzxXOK0SdttEhLkKb4f39333dlJArfowZcWXWmUcBNFx0rqNwqtd7CCbHkJSQI3uOVWoXNg7igc4QFtgdrzLUJRcr3FKQijX3jgbSbIOxBcqiYcHXCLUGuBlpKlGwru6uUdBtU7S7t6H4%2FhwZse2ugJBVxTXlE7byq0LR73QIC1EqCNHyJbePxZqNpJo1s%2B689vb9i7vSWKL3dofafeCN50ecHAskVJeZ9ydrt%2Bz4IuLP8wAfp%2Bw48SidlGVniNGi33KOAKIkE%2FnoxRlmaLWfp6li028%2BXFMrtYnr9Kw%2FclhhnMRdwjubqquJW%2FiLCptY9i%2BNrsGeZGIHN95IM191j4I%2Be073fT9k8NdyjsmJ3izpPGNJzGjUmepeL%2FkSTwf86StmhttC%2F3TMnznXrb4thlySWiEAAJNUJ9TSELQ8%2B5KmpFJMB57qXzshhpwgYjAQ270Ld3b6SGb1KLldSkyVhHox9nFGRs1zM69EPJHeO6iYZNjeNnZGg5Pz37E4lOlZnuLtUKovHWzE4iY3gJ8zQ90qvPHt6ATrZgZZXR0hu7E22k4zOU%2Fp7BUHz%2FdvTTDsfkkZx%2B8N1%2B09rQnLrYyWHnB%2BM6KXM1eq6ShGtxcO86b7g%2FfwA%3D/prettify/1/timespan/2024-06-22T15%3a52%3a59.0000000Z%2f2024-06-24T15%3a52%3a59.0000000Z',
            linkToSearchResultsAPI:
              'https://api.loganalytics.io/v1/workspaces/0705d4b3-c36a-4100-994d-3c46488dc860/query?query=%2F%2F%20Set%20thresholds%0Alet%20minAlerts%20%3D%2025%3B%20%2F%2F%20Regarless%20of%20the%20percentage%20change%2C%20don%27t%20alert%20if%20daily%20alerts%20are%20under%20this%20threshold%0Alet%20minChange%20%3D%2030%3B%20%2F%2F%20Percentage%20change%20to%20alert%20on%0A%2F%2F%20Get%20customers%20that%20should%20not%20alert%20on%0Alet%20exclusions%20%3D%20MXDR_Exclusions%28%29%3B%0A%2F%2F%20Get%20alerts%20today%0Alet%20alerts_24h%20%3D%20QC_SMI_Alerts_CL%0A%20%20%20%20%7C%20where%20TimeGenerated%20%3E%20%28datetime%282024-06-24T15%3A52%3A59.0000000Z%29%20-%201d%29%0A%20%20%20%20%7C%20summarize%20count%28%29%20by%20customerCode_s%0A%20%20%20%20%7C%20project%20customerCode_s%2C%20alertsToday%20%3D%20count_%3B%0A%2F%2F%20Get%20alerts%20last%2030%20days%0Alet%20alerts_30d%20%3D%20QC_SMI_Alerts_CL%0A%20%20%20%20%7C%20where%20TimeGenerated%20%3E%20%28datetime%282024-06-24T15%3A52%3A59.0000000Z%29%20-%2030d%29%0A%20%20%20%20%7C%20summarize%20count%28%29%20by%20customerCode_s%0A%20%20%20%20%7C%20project%20customerCode_s%2C%20alertsThisMonth%20%3D%20count_%2C%20averageThisMonth%20%3D%20round%28count_%20%2F%2030.00%2C%202%29%3B%0A%2F%2F%20Calculate%20statistics%0Alet%20alert_statistics%20%3D%20alerts_24h%0A%20%20%20%20%7C%20join%20kind%3Dinner%20alerts_30d%20on%20customerCode_s%0A%20%20%20%20%7C%20where%20not%20%28customerCode_s%20has_any%28exclusions%29%29%0A%20%20%20%20%7C%20project%20customerCode%20%3D%20customerCode_s%2C%20alertsToday%2C%20alertsThisMonth%2C%20averageThisMonth%2C%20change%20%3D%20%28alertsToday%20-%20averageThisMonth%29%20%2A%20100%3B%0A%2F%2F%20Calculate%20change%20percentage%0Alet%20change_monitor%20%3D%20alert_statistics%0A%20%20%20%20%7C%20project%20customerCode%2C%20alertsToday%2C%20alertsThisMonth%2C%20averageThisMonth%2C%20percentageChange%20%3D%20round%28change%20%2F%20averageThisMonth%2C%202%29%3B%0A%2F%2F%20Alert%20con%20change%0Achange_monitor%0A%20%20%20%20%7C%20where%20percentageChange%20%3E%20minChange%20%2F%2Fand%20alertsToday%20%3E%20minAlerts&timespan=2024-06-22T15%3a52%3a59.0000000Z%2f2024-06-24T15%3a52%3a59.0000000Z',
            linkToFilteredSearchResultsAPI:
              'https://api.loganalytics.io/v1/workspaces/0705d4b3-c36a-4100-994d-3c46488dc860/query?query=%2F%2F%20Set%20thresholds%0Alet%20minAlerts%20%3D%2025%3B%20%2F%2F%20Regarless%20of%20the%20percentage%20change%2C%20don%27t%20alert%20if%20daily%20alerts%20are%20under%20this%20threshold%0Alet%20minChange%20%3D%2030%3B%20%2F%2F%20Percentage%20change%20to%20alert%20on%0A%2F%2F%20Get%20customers%20that%20should%20not%20alert%20on%0Alet%20exclusions%20%3D%20MXDR_Exclusions%28%29%3B%0A%2F%2F%20Get%20alerts%20today%0Alet%20alerts_24h%20%3D%20QC_SMI_Alerts_CL%0A%20%20%20%20%7C%20where%20TimeGenerated%20%3E%20%28datetime%282024-06-24T15%3A52%3A59.0000000Z%29%20-%201d%29%0A%20%20%20%20%7C%20summarize%20count%28%29%20by%20customerCode_s%0A%20%20%20%20%7C%20project%20customerCode_s%2C%20alertsToday%20%3D%20count_%3B%0A%2F%2F%20Get%20alerts%20last%2030%20days%0Alet%20alerts_30d%20%3D%20QC_SMI_Alerts_CL%0A%20%20%20%20%7C%20where%20TimeGenerated%20%3E%20%28datetime%282024-06-24T15%3A52%3A59.0000000Z%29%20-%2030d%29%0A%20%20%20%20%7C%20summarize%20count%28%29%20by%20customerCode_s%0A%20%20%20%20%7C%20project%20customerCode_s%2C%20alertsThisMonth%20%3D%20count_%2C%20averageThisMonth%20%3D%20round%28count_%20%2F%2030.00%2C%202%29%3B%0A%2F%2F%20Calculate%20statistics%0Alet%20alert_statistics%20%3D%20alerts_24h%0A%20%20%20%20%7C%20join%20kind%3Dinner%20alerts_30d%20on%20customerCode_s%0A%20%20%20%20%7C%20where%20not%20%28customerCode_s%20has_any%28exclusions%29%29%0A%20%20%20%20%7C%20project%20customerCode%20%3D%20customerCode_s%2C%20alertsToday%2C%20alertsThisMonth%2C%20averageThisMonth%2C%20change%20%3D%20%28alertsToday%20-%20averageThisMonth%29%20%2A%20100%3B%0A%2F%2F%20Calculate%20change%20percentage%0Alet%20change_monitor%20%3D%20alert_statistics%0A%20%20%20%20%7C%20project%20customerCode%2C%20alertsToday%2C%20alertsThisMonth%2C%20averageThisMonth%2C%20percentageChange%20%3D%20round%28change%20%2F%20averageThisMonth%2C%202%29%3B%0A%2F%2F%20Alert%20con%20change%0Achange_monitor%0A%20%20%20%20%7C%20where%20percentageChange%20%3E%20minChange%20%2F%2Fand%20alertsToday%20%3E%20minAlerts&timespan=2024-06-22T15%3a52%3a59.0000000Z%2f2024-06-24T15%3a52%3a59.0000000Z',
            event: null,
          },
        ],
        windowStartTime: '2024-06-22T15:52:59Z',
        windowEndTime: '2024-06-24T15:52:59Z',
      },
    },
    customProperties: {
      TestProperty: 'Jacob',
    },
  },
};
