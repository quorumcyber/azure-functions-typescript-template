export type AlertTypes = 'XDR' | 'MDR' | 'CTEM' | 'MDS' | 'TI' | 'Demo';

export type ProjectConfigType = {
  name: string;
  projectKey: string;
  alertTypes: AlertTypes; //This must be unique
  issueTypeId: string;
  priority: string;
  projectId: number;
};

export const projects: ProjectConfigType[] = [
  {
    name: 'XDR',
    projectKey: 'MXDR',
    projectId: 10310,
    alertTypes: 'XDR',
    issueTypeId: '10090',
    priority: 'High',
  },
  {
    name: 'SMI',
    projectKey: 'SMI',
    projectId: 10310,
    alertTypes: 'Demo',
    issueTypeId: '10205',
    priority: 'High',
  },
];
