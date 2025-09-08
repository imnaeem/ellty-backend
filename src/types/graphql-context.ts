import { Request, Response } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface GraphQLContext {
  req: Request & {
    user?: AuthenticatedUser;
  };
  res: Response;
}

export interface AuthenticatedContext extends GraphQLContext {
  req: Request & {
    user: AuthenticatedUser;
  };
}
