import { identity } from '@qcyber/azure';
import { z } from 'zod';

import log from './logHandler';

export const fetchAlertData = async (queryUrl: string, alertName: string) => {
  try {
    const results = await fetchResults(queryUrl, alertName);
    const adfTable = toADFTableFormat(results);
    return adfTable;
  } catch (error) {
    log({
      message: `Error fetching alert data: ${JSON.stringify(error)}`,
      level: 'error',
      function: 'fetchAlertData',
      alertName,
    });
    return {};
  }
};

const ResultsSchema = z.object({
  tables: z.array(
    z.object({
      name: z.string(),
      columns: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
        }),
      ),
      rows: z.array(z.array(z.unknown())),
    }),
  ),
});

export type ResultsSchema = z.infer<typeof ResultsSchema>;

const fetchResults = async (queryUrl: string, alertName: string) => {
  const token = await identity.getCachedToken('https://api.loganalytics.io', 'qc-prod-cust-QC-kv');
  log({
    message: `Fetching results from Log Analytics...`,
    level: 'info',
    function: 'fetchResults',
    alertName,
  });
  const response = await fetch(queryUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.token}`,
    },
  });

  if (!response.ok) {
    log({
      message: `Failed to fetch results: ${response.statusText}`,
      level: 'error',
      function: 'fetchResults',
      alertName,
    });
    throw new Error(`Failed to fetch results: ${response.statusText}`);
  }
  log({
    message: `Results fetched from Log Analytics: ${response.status}`,
    level: 'info',
    function: 'fetchResults',
    alertName,
  });
  const parsedData = ResultsSchema.safeParse(await response.json());
  if (!parsedData.success) {
    log({
      message: `Failed to parse results: ${JSON.stringify(parsedData.error)}`,
      level: 'error',
      function: 'fetchResults',
      alertName,
    });
    throw new Error(`Failed to parse results: ${JSON.stringify(parsedData.error)}`);
  }
  return parsedData.data;
};

const toADFTableFormat = (data: ResultsSchema) => {
  type TableContent = { type: string; attrs?: unknown; content: unknown[] };
  type TableTextContent = {
    type: string;
    attrs: unknown;
    content: [{ type: string; content: [{ type: string; text: string }] }];
  };

  const table = {
    type: 'table',
    attrs: {},
    content: [] as unknown as TableContent[],
  };

  data.tables.forEach((tableData) => {
    const headerRow = {
      type: 'tableRow',
      content: [] as TableTextContent[],
    };

    tableData.columns.forEach((column) => {
      const row: TableTextContent = {
        type: 'tableHeader',
        attrs: {},
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: column.name,
              },
            ],
          },
        ],
      };
      headerRow.content.push(row);
    });

    table.content.push(headerRow);

    tableData.rows.forEach((row) => {
      const dataRow: TableContent = {
        type: 'tableRow',
        content: [],
      };

      row.forEach((cell) => {
        dataRow.content.push({
          type: 'tableCell',
          attrs: {},
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: String(cell),
                },
              ],
            },
          ],
        } as TableTextContent);
      });

      table.content.push(dataRow);
    });
  });

  return table;
};

//Local Testing Function
if (require.main === module) {
  const runTest = async () => {
    const testUrl =
      'https://api.loganalytics.io/v1/workspaces/0705d4b3-c36a-4100-994d-3c46488dc860/query?query=%2F%2F%20Set%20thresholds%0Alet%20minAlerts%20%3D%2025%3B%20%2F%2F%20Regarless%20of%20the%20percentage%20change%2C%20don%27t%20alert%20if%20daily%20alerts%20are%20under%20this%20threshold%0Alet%20minChange%20%3D%2030%3B%20%2F%2F%20Percentage%20change%20to%20alert%20on%0A%2F%2F%20Get%20customers%20that%20should%20not%20alert%20on%0Alet%20exclusions%20%3D%20MXDR_Exclusions%28%29%3B%0A%2F%2F%20Get%20alerts%20today%0Alet%20alerts_24h%20%3D%20QC_SMI_Alerts_CL%0A%20%20%20%20%7C%20where%20TimeGenerated%20%3E%20%28datetime%282024-06-24T15%3A52%3A59.0000000Z%29%20-%201d%29%0A%20%20%20%20%7C%20summarize%20count%28%29%20by%20customerCode_s%0A%20%20%20%20%7C%20project%20customerCode_s%2C%20alertsToday%20%3D%20count_%3B%0A%2F%2F%20Get%20alerts%20last%2030%20days%0Alet%20alerts_30d%20%3D%20QC_SMI_Alerts_CL%0A%20%20%20%20%7C%20where%20TimeGenerated%20%3E%20%28datetime%282024-06-24T15%3A52%3A59.0000000Z%29%20-%2030d%29%0A%20%20%20%20%7C%20summarize%20count%28%29%20by%20customerCode_s%0A%20%20%20%20%7C%20project%20customerCode_s%2C%20alertsThisMonth%20%3D%20count_%2C%20averageThisMonth%20%3D%20round%28count_%20%2F%2030.00%2C%202%29%3B%0A%2F%2F%20Calculate%20statistics%0Alet%20alert_statistics%20%3D%20alerts_24h%0A%20%20%20%20%7C%20join%20kind%3Dinner%20alerts_30d%20on%20customerCode_s%0A%20%20%20%20%7C%20where%20not%20%28customerCode_s%20has_any%28exclusions%29%29%0A%20%20%20%20%7C%20project%20customerCode%20%3D%20customerCode_s%2C%20alertsToday%2C%20alertsThisMonth%2C%20averageThisMonth%2C%20change%20%3D%20%28alertsToday%20-%20averageThisMonth%29%20%2A%20100%3B%0A%2F%2F%20Calculate%20change%20percentage%0Alet%20change_monitor%20%3D%20alert_statistics%0A%20%20%20%20%7C%20project%20customerCode%2C%20alertsToday%2C%20alertsThisMonth%2C%20averageThisMonth%2C%20percentageChange%20%3D%20round%28change%20%2F%20averageThisMonth%2C%202%29%3B%0A%2F%2F%20Alert%20con%20change%0Achange_monitor%0A%20%20%20%20%7C%20where%20percentageChange%20%3E%20minChange%20%2F%2Fand%20alertsToday%20%3E%20minAlerts&timespan=2024-06-22T15%3a52%3a59.0000000Z%2f2024-06-24T15%3a52%3a59.0000000Z';
    const results = await fetchResults(testUrl, 'Test Alert');
    console.log(JSON.stringify(toADFTableFormat(results)));
  };
  runTest().catch((error) => {
    console.error(`Error creating issue: ${error}`);
  });
}
