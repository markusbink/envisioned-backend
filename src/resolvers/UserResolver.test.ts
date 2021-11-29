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

    const registerMutation = `
        mutation registerMutation($options: RegisterUserInput!) {
            register(options: $options) {
                username,
                email
            }
        }
    `;

    const loginMutation = `
        mutation loginMutation($options: LoginUserInput!) {
            login(options: $options) {
                username,
                email
            }
        }
    `;

    const getUsersQuery = `
        query getUsersQuery{
            getUsers {
                id
                username
                email
            }
        }
    `;

    it('should register a user with specified data', async () => {
        const response = await callGraphQL({
            source: registerMutation,
            variableValues: { options: data },
        });

        expect(response?.data?.register).toMatchObject({
            username: data.username,
            email: data.email,
        });
    });

    it('should fail to register a user with too short password', async () => {
        const response = await callGraphQL({
            source: registerMutation,
            variableValues: { options: { ...data, password: 'abc' } },
        });

        expect(response?.errors).toBeDefined();
    });

    it('should fail to register a user with invalid email', async () => {
        const response = await callGraphQL({
            source: registerMutation,
            variableValues: { options: { ...data, email: 'john.doe' } },
        });

        expect(response?.errors).toBeDefined();
    });

    it('should login user with specified email and password', async () => {
        const loginOptions = {
            email: data.email,
            password: data.password,
        };

        const response = await callGraphQL({
            source: loginMutation,
            variableValues: {
                options: loginOptions,
            },
        });

        expect(response?.data?.login).toHaveProperty('username', data.username);
        expect(response?.data?.login).not.toHaveProperty('password');
    });

    it('should fail to login user with non existant email', async () => {
        const loginOptions = {
            email: 'jane.doe@example.com',
            password: data.password,
        };

        const response = await callGraphQL({
            source: loginMutation,
            variableValues: {
                options: loginOptions,
            },
        });

        expect(response?.errors).toBeDefined();
    });

    it('should query a list of all users', async () => {
        const response = await callGraphQL({
            source: getUsersQuery,
        });

        const users = response?.data?.getUsers;

        expect(users).toBeDefined();
        expect(users.length).toBeGreaterThanOrEqual(1);
    });

    it('should query a user by id', async () => {
        const response = await callGraphQL({
            source: getUsersQuery,
        });

        const { id } = response?.data?.getUsers[0];

        const userQuery = `
            query getUserById($id: String!) {
                getUser(id: $id) {
                    id
                    username
                    email
                }
            }
        `;

        const userResponse = await callGraphQL({
            source: userQuery,
            variableValues: {
                id,
            },
        });

        const singleUser = userResponse?.data?.getUser;

        expect(singleUser).toBeDefined();
        expect(singleUser.id).toBe(id);
    });
});
