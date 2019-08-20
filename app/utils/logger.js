import winston, { format } from 'winston';
import packageJson from '../../package.json';

import config from '../config';

const { timestamp, printf } = format;

const logFormat = printf(info => `
  ${info.timestamp} | v.${packageJson.version} | ${info.level}: ${info.message}
`);

const logger = winston.createLogger({
  level: config.logLevel || 'info',
  format: format.combine(
    timestamp(),
    logFormat,
  ),

  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test2') {
  logger.add(new winston.transports.Console({
    format: format.combine(
      timestamp(),
      logFormat,
    ),
  }));
}

export const logHttpRequestError = (request, errorObj) => {
  const logObj = {
    message: errorObj.message,
    stack: errorObj.stack,
    url: request.url,
    query: JSON.stringify(request.query),
    body: JSON.stringify(request.body),
    userEmail: request.user.email,
  };
  logger.error(logObj);
};

export const logException = (errorObj, errorType, otherProperties = {}) => {
  let logObj = {
    message: errorObj.message,
    stack: errorObj.stack,
    errorType,
  };
  logObj = Object.assign(otherProperties, logObj); // merge objects
  if (logObj.stack) {
    logger.error(logObj.stack);
  } else {
    logger.error(errorObj);
  }
};

export default logger;
