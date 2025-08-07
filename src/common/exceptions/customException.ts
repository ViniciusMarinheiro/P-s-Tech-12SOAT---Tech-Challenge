import { HttpException, HttpStatus } from '@nestjs/common'

export class CustomException extends HttpException {
  constructor(message: string, status?: HttpStatus)
  constructor(message: () => string, status?: HttpStatus)
  constructor(
    message: string | (() => string),
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    const finalMessage = typeof message === 'function' ? message() : message

    super(
      {
        status,
        message: finalMessage,
        timestamp: new Date().toISOString(),
      },
      status,
    )
  }
}
