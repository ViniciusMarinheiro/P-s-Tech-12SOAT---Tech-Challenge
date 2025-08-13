import { UserJwtPayload } from '@/modules/auth/interfaces/auth-response.interface'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest()
    const user = request.user as UserJwtPayload
    return user.id
  },
)
