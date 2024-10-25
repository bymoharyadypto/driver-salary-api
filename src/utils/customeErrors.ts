export class BadRequestError extends Error {
  status = 400;

  constructor(message: string) {
    super(message);
    this.name = "Bad Request";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Not Found";
  }
}
