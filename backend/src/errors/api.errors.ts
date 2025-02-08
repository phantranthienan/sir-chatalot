export class ApiError extends Error {
    public statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export class BadRequestError extends ApiError {
    constructor(message = 'Bad request') {
      super(400, message);
    }
  }
export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized access') {
        super(401, message);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = 'Access forbidden') {
        super(403, message);
    }
}
export class NotFoundError extends ApiError {
    constructor(message = 'Ressource not found') {
        super(404, message);
    }
}


export class ConflictError extends ApiError {
    constructor(message = 'Resource conflict') {
        super(409, message);
    }
}
