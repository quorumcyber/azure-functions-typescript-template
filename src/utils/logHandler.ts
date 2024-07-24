import winston from 'winston';

import ENV from '../env';

export type LogMessage = {
  message: string | Error | JSON;
  level: 'info' | 'warn' | 'error' | 'verbose';
  project?: string;
  alertName?: string;
  issueKey?: string;
  function: string;
};

const logger = winston.createLogger({
  level: ENV.LogLevel,
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const log = (logMessage: LogMessage) => {
  try {
    let message = logMessage.message;
    if (typeof message === 'object') {
      message = JSON.stringify(message);
    }

    const metadata = {
      function: logMessage.function,
      project: logMessage.project,
      alertName: logMessage.alertName,
      issueKey: logMessage.issueKey,
    };

    logger.log(logMessage.level, message, { meta: metadata });
  } catch (error) {
    logger.error(error);
  }
};

export default log;
