import AppError from '../appError';

// eslint-disable-next-line import/prefer-default-export
export function throwErrorIfTruthy(
  condition,
  error,
) {
  if (condition) {
    throw error;
  }
}

export function throwErrorIfFalsy(
  condition,
  error,
) {
  throwErrorIfTruthy(
    !condition,
    error,
  );
}

export function throwAppErrorIfTruthy(
  condition,
  errorMessage,
) {
  throwErrorIfTruthy(
    condition,
    new AppError(errorMessage),
  );
}

export function throwAppErrorIfFalsy(
  condition,
  errorMessage,
) {
  throwErrorIfFalsy(
    condition,
    new AppError(errorMessage),
  );
}
