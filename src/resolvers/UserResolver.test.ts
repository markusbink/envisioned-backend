import { Connection } from 'typeorm';
import {
    callGraphQL,
    clearDatabase,
    createDatabaseConnection,
} from '../test-utils';

let connection: Connection;

beforeAll(async () => {
    connection = await createDatabaseConnection();
});

afterAll(async () => {
    await clearDatabase(connection);
    await connection.close();
});

describe('Database', () => {
    it('should create connection to the test database', async () => {
        expect(connection).toBeDefined();
        expect(connection.isConnected).toBeTruthy();
        expect(connection.options.database).toBe('envisioned_test');
    });
});

describe('UserResolver', () => {
    const data = {
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'johndoepassword',
    };

    it('should register a user with specified data', async () => {
        const mutation = `
            mutation registerMutation($options: RegisterUserInput!) {
                register(options: $options) {
                    username,
                    email
                }
            }
        `;

        const response = await callGraphQL({
            source: mutation,
            variableValues: { options: data },
        });

        expect(response?.data?.register).toMatchObject({
            username: data.username,
            email: data.email,
        });
    });

    it('should login user with specified email and password', async () => {
        const mutation = `
            mutation loginMutation($options: LoginUserInput!) {
                login(options: $options) {
                    username,
                    email
                }
            }
        `;

        const loginOptions = {
            email: data.email,
            password: data.password,
        };

        const response = await callGraphQL({
            source: mutation,
            variableValues: {
                options: loginOptions,
            },
        });

        expect(response?.data?.login).toHaveProperty('username', data.username);
        expect(response?.data?.login).not.toHaveProperty('password');
    });
});
