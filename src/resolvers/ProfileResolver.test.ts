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

describe('ProfileResovler', () => {
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

    const getUsersQuery = `
        query {
            getUsers {
                id
                username
                email
            }
        }
    `;

    const createProfileMutation = `
            mutation createProfileMutation($options: CreateProfileInput!) {
                createProfile(options: $options) {
                    bio
                    profileImageURI
                }
            }
        `;

    const createProfileOptions = {
        bio: 'I am a bio',
        profileImageURI: 'https://example.com/image.png',
    };

    it('should create a profile for the current user and given info', async () => {
        // Register a user
        await callGraphQL({
            source: registerMutation,
            variableValues: { options: data },
        });

        // Get a user
        const getUsersResponse = await callGraphQL({
            source: getUsersQuery,
        });

        const { id } = getUsersResponse?.data?.getUsers[0];

        // Create a profile for user with specified id
        const profileReponse = await callGraphQL({
            source: createProfileMutation,
            variableValues: {
                options: createProfileOptions,
            },
            userId: id,
        });

        expect(profileReponse.data?.createProfile).toHaveProperty(
            'bio',
            createProfileOptions.bio
        );
        expect(profileReponse.data?.createProfile).toHaveProperty(
            'profileImageURI',
            createProfileOptions.profileImageURI
        );
    });

    it('should update the profile with the specified data', async () => {
        // Get a user
        const getUsersResponse = await callGraphQL({
            source: getUsersQuery,
        });

        const { id } = getUsersResponse?.data?.getUsers[0];

        const updateProfileMutation = `
            mutation updateProfileMutation($options: UpdateProfileInput!) {
                updateProfile(options: $options)
            }
        `;

        const updateProfileOptions = {
            bio: 'I am a new bio',
            profileImageURI: 'https://example.com/new-image.png',
        };

        // Update the profile
        const profileResponse = await callGraphQL({
            source: updateProfileMutation,
            variableValues: {
                options: updateProfileOptions,
            },
            userId: id,
        });

        expect(profileResponse.data?.updateProfile).toBeTruthy();
    });

    it('should fail to update a profile with non-existant user id', async () => {
        const updateProfileMutation = `
            mutation updateProfileMutation($options: UpdateProfileInput!) {
                updateProfile(options: $options)
            }
        `;

        const updateProfileOptions = {
            bio: 'I am a new bio',
            profileImageURI: 'https://example.com/new-image.png',
        };

        const profileResponse = await callGraphQL({
            source: updateProfileMutation,
            variableValues: {
                options: updateProfileOptions,
            },
            userId: 'non-existant-user-id',
        });

        expect(profileResponse.errors?.[0].message).toBe(
            'Profile with provided ID does not exist'
        );
    });

    it('should fail to create a profile for not having a current session', async () => {
        // Create a profile for user with specified id
        const profileReponse = await callGraphQL({
            source: createProfileMutation,
            variableValues: {
                options: createProfileOptions,
            },
            userId: null,
        });

        expect(profileReponse.errors).toBeDefined();
        expect(profileReponse.errors?.[0].message).toBe(
            'Not authenticated to perform the requested action.'
        );
    });
});
