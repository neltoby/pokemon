import { Request, Response, NextFunction } from 'express';
import { ValidationError as DtoValidationError } from '../../../shared/validation/validate-dto';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Prefer structured logging but keep console for simplicity here
  // eslint-disable-next-line no-console
  console.error(err);

  // Narrow the error type
  const maybeStatusCode = (e: unknown): number | undefined =>
    typeof e === 'object' && e !== null && 'statusCode' in e
      ? (e as { statusCode?: number }).statusCode
      : undefined;

  const status =
    err instanceof DtoValidationError
      ? err.statusCode
      : maybeStatusCode(err) ?? 500;

  const message =
    err instanceof Error && err.message
      ? err.message
      : 'Something went wrong. Please try again.';

  res.status(status).json({ error: message });
}
