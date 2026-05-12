import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthedUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'organizer';
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthedUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthedUser }>();
    return request.user;
  },
);
