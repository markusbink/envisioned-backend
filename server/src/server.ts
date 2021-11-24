import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { NFTResolver, UserResolver } from './resolvers/';

// Get environment variables
dotenv.config({ path: './server/.env' });

const main = async () => {
    await createConnection();

    // Setting up Redis
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    // Setting up Express
    const app = express();

    const corsOptions = {
        origin: 'https://studio.apollographql.com',
        credentials: true,
    };
    app.use(cors(corsOptions));

    // Setting up Sessions
    app.use(
        session({
            name: process.env.SESSION_COOKIE_NAME,
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET!,
            resave: false,
        })
    );

    // Setting up Apollo Server
    const schema = await buildSchema({
        resolvers: [NFTResolver, UserResolver],
        validate: false,
    });

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}/graphql`)
    );
};

main();
