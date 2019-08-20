import {
  sendErrorResponse,
  sendExceptionResponse,
} from './responseUtils';
import AppError from '../appError';
import { DEFAULT_ERROR_MESSAGE } from '../constants';
import logger, * as loggerMethods from './logger';

describe('responseUtils', () => {
  let res;
  let sendSpy;
  let statusSpy;
  let statusSendSpy;
  let sendStatusSpy;
  let logInfoStub;
  let logErrorStub;
  let logExceptionStub;
  beforeEach(() => {
    sendSpy = jest.fn();
    statusSendSpy = jest.fn();
    statusSpy = jest.fn().mockReturnValue({ send: statusSendSpy });
    sendStatusSpy = jest.fn();
    res = {
      status: statusSpy,
      send: sendSpy,
      json: jest.fn(),
      sendStatus: sendStatusSpy,
    };
    logInfoStub = jest.spyOn(logger, 'info');
    logErrorStub = jest.spyOn(logger, 'error');
    logExceptionStub = jest.spyOn(loggerMethods, 'logException');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('sendErrorResponse', () => {
    it('should return 500 error when passed', async () => {
      sendErrorResponse(res, 500, 'ERROR');
      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(statusSendSpy).toHaveBeenCalledWith({ errorMessage: 'ERROR' });
    });
    it('should return 400 when passed', async () => {
      sendErrorResponse(res, 400, 'ERROR');
      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(statusSendSpy).toHaveBeenCalledWith({ errorMessage: 'ERROR' });
    });
    it('should log an info log when called with a 400', async () => {
      sendErrorResponse(res, 400, 'ERROR');
      expect(logInfoStub).toHaveBeenCalled();
    });
    it('should log an error log when called with a 500', async () => {
      sendErrorResponse(res, 500, 'ERROR');
      expect(logErrorStub).toHaveBeenCalled();
    });
  });
  describe('sendExceptionResponse', () => {
    it('should return 500 error when passed', async () => {
      const error = new Error('ERROR');
      sendExceptionResponse(res, error);
      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(statusSendSpy).toHaveBeenCalledWith({ errorMessage: DEFAULT_ERROR_MESSAGE });
    });
    it('should return 400 when passed', async () => {
      const error = new AppError('ERROR');
      sendExceptionResponse(res, error);
      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(statusSendSpy).toHaveBeenCalledWith({ errorMessage: error.message });
    });
    it('should log an error log when called with a 400', async () => {
      const error = new AppError('ERROR');
      sendExceptionResponse(res, error);
      expect(logInfoStub).not.toHaveBeenCalled();
      expect(logErrorStub).toHaveBeenCalled();
      expect(logExceptionStub).toHaveBeenCalled();
    });
    it('should log an error log when called with a 500', async () => {
      const error = new Error('ERROR');
      sendExceptionResponse(res, error);
      expect(logInfoStub).not.toHaveBeenCalled();
      expect(logErrorStub).toHaveBeenCalled();
      expect(logExceptionStub).toHaveBeenCalled();
    });
  });
});
