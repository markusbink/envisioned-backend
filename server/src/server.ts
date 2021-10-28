import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { NFTResolver } from './resolvers/';
import { createConnection } from 'typeorm';

// Get environment variables
dotenv.config({ path: './server/.env' });

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [NFTResolver],
        validate: false,
    });

    const apolloServer = new ApolloServer({ schema });
    await apolloServer.start();

    const app = express();
    apolloServer.applyMiddleware({ app });
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
    );
};

main();
