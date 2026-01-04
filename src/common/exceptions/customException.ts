import { HttpException, HttpStatus, Logger } from '@nestjs/common'

export class CustomException extends HttpException {
  private readonly logger = new Logger(CustomException.name)

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
    this.logger.warn(finalMessage, {
      status,
      statusCode: status,
      timestamp: new Date().toISOString(),
    })
  }
}
