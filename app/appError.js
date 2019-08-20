export default class AppError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, AppError);
    // Had to add a differentiator as checking for type does not work
    this.isAppError = true;
  }
}
