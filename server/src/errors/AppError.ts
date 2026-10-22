type AppErrorOptions = {
  log?: string;
  cause?: unknown;
};

export default class AppError extends Error {
  log?: string;

  constructor(
    message: string,
    public statusCode: number = 500,
    options: AppErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.log = options.log;
  }
}

// Example Usage
/*
next(
  new AppError('Invalid username or password', 400, {
    log: 'userController.signup: Validation failed',
    cause: result.error,
  }),
);
*/
