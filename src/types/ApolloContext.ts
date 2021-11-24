import { Request, Response } from 'express';
import { Session } from 'express-session';

type SessionWithUser = Session & { userId: string };

export interface ApolloContext {
    req: Request & { session: SessionWithUser };
    res: Response;
}
