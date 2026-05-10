import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../../lib/auth';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.session?.user as AuthUser;
    if (data) return user?.[data];
    return user;
  },
);
