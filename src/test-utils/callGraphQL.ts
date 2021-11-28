import { graphql, GraphQLSchema } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { createGraphQLSchema } from './createGraphQLSchema';

interface GraphQLArgsOptions {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any;
    }>;
    userId?: string | null;
}

let schema: GraphQLSchema;

/**
 * Calls the GraphQL API with the given source and variableValues
 * @param source The GraphQL query or mutation
 * @param variableValues The variables to pass to the GraphQL query or mutation
 * @param userId The userId to set on the context
 * @returns Response of the GraphQL query or mutation
 */
export const callGraphQL = async ({
    source,
    variableValues,
    userId,
}: GraphQLArgsOptions) => {
    if (!schema) {
        schema = await createGraphQLSchema();
    }

    return await graphql({
        schema,
        source,
        variableValues,
        contextValue: {
            req: {
                session: {
                    userId: userId || null,
                },
            },
            res: {},
        },
    });
};
