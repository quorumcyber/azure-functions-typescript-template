# Security Metrics - Azure Alert -> Jira Function App

## Purpose

This app takes an Azure alert function app webhook with the CommonAlertSchema applied and completed the following actions:

- Query and tabulate alert data from the API details in the alert.
- Parse alert details and results into ADF format.
- Log the alert and results as an intenral ticket in the project define in the webhook.

## Error Logging

This app has structured error logging in place. It is important any implementation of this sets up a secondary alert method that fires on any Error level alerts to identify failures in this connector.

Common failures may occur when an Azure Alert is not setup to use the CommonAlertSchema or when an incorrect Project key is defined.

### Predefine Projects

All projects processed using this app must be predefined including the Project Key, IssueType ID and Alert Type details. Once defined, the AlertType should be included as a Parameter in the webhook to trigger the correct alert.

### Webhook Format

http://api.quorumcyber.com/api/smi/alert/{alertType}?code={functionKey}

### Flow Diagram

![image](https://github.com/quorumcyber/azure-functions-typescript-template/assets/149156952/ff8c277a-8844-4d1c-bfe6-58be63c1a9a9)



### Example Jira Output

![image](https://github.com/quorumcyber/azure-functions-typescript-template/assets/149156952/94a515de-d491-4556-b5c5-dd83e606b43e)

