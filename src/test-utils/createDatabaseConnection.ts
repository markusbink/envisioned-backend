import { Connection, createConnection } from 'typeorm';

/**
 * Creates a connection to the test database
 * @param drop If true, drops the database before creating a new one.
 * @param log If true, logs the SQL queries to the console
 * @returns Connection to the test database
 */
export const createDatabaseConnection = async (
    drop: boolean = true,
    log: boolean = false
): Promise<Connection> => {
    const connection = await createConnection({
        name: 'default',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'envisioned_test',
        dropSchema: drop,
        synchronize: drop,
        logging: log,
        entities: ['./src/entities/*.*'],
    });

    return connection;
};
