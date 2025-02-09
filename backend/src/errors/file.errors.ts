// src/errors/file.errors.ts
import { ApiError } from './api.errors';

/**
 * Thrown when no file is provided in the request.
 */
export class FileNotFoundError extends ApiError {
  constructor(message = 'No file uploaded') {
    super(400, message);
  }
}

/**
 * Thrown when the file is not a valid image (e.g., invalid MIME type).
 */
export class InvalidMimeTypeError extends ApiError {
  constructor(message = 'Invalid or non-image file') {
    super(400, message);
  }
}

/**
 * Thrown when the file exceeds the maximum allowed size (optional).
 */
export class FileTooLargeError extends ApiError {
  constructor(message = 'File size exceeds the maximum allowed size') {
    super(400, message);
  }
}
