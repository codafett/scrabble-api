import logger, { logException } from './logger';
import { matchWholeWordRegEx } from './stringUtils';
import { DEFAULT_ERROR_MESSAGE } from '../constants';

function sendError(
  res,
  status,
  errorMessage,
  logMessage,
) {
  if (logMessage) {
    if (status === 500) {
      logger.error(errorMessage);
    } else if (status === 400) {
      logger.info(errorMessage);
    }
  }
  return res.status(status).send({ errorMessage });
}

/* eslint-disable import/prefer-default-export */
export const sendErrorResponse = (
  res,
  status,
  errorMessage,
) => sendError(res, status, errorMessage, true);

export const sendExceptionResponse = (
  res,
  ex,
) => {
  const regex = matchWholeWordRegEx('test');
  if (!process.env.NODE_ENV || process.env.NODE_ENV.match(regex)) {
    logException(ex);
  }
  if (ex.isAppError) {
    return sendError(res, 400, ex.message, false);
  }
  return sendError(res, 500, DEFAULT_ERROR_MESSAGE, false);
};
