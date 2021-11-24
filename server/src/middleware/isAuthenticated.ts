import { MiddlewareFn, NextFn, ResolverData } from 'type-graphql';
import { ApolloContext } from '../types';

/**
 * Check whether the user is authenticated
 * @param context Resolver data
 * @param next Executes middleware
 * @returns
 */
export const isAuthenticated: MiddlewareFn<ApolloContext> = (
    { context }: ResolverData<ApolloContext>,
    next: NextFn
) => {
    if (!context.req.session.userId) {
        throw new Error('Not authenticated to perform the requested action.');
    }

    return next();
};
