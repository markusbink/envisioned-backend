import { buildSchema } from 'type-graphql';
import { NFTResolver, ProfileResolver, UserResolver } from '../resolvers';

/**
 * Create Mock GraphQL Schema
 * @returns a GraphQL schema
 */
export const createGraphQLSchema = async () => {
    return await buildSchema({
        resolvers: [NFTResolver, UserResolver, ProfileResolver],
        validate: true,
    });
};
