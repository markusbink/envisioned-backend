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

describe('NFTResolver', () => {
    const userData = [
        {
            username: 'johndoe',
            email: 'john.doe@example.com',
            password: 'johndoepassword',
        },
        {
            username: 'janedoe',
            email: 'jane.doe@example.com',
            password: 'janedoepassword',
        },
    ];

    const nftData = {
        title: 'Zizibu Crypto Punk #1691 - Ethereum Edition',
        shortDescription:
            'Crypto Nft Creator Team - Verified account on Rarible.',
        longDescription: 'This is a really long description with emojis',
        imageURI:
            'https://rarible.com/token/0xf6793da657495ffeff9ee6350824910abc21356c:79620866622375052805449593826879326143915809581831826021747550262892660018088?tab=details',
        sourceURI:
            'https://rarible.com/token/0xf6793da657495ffeff9ee6350824910abc21356c:79620866622375052805449593826879326143915809581831826021747550262892660018088?tab=details',
        category: 'Art',
    };

    const updateNFTData = {
        title: 'Updated title',
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

    const getAllNFTsQuery = `
            query getAllNFTsQuery{
                getAllNFTs {
                    id
                    title
                    shortDescription
                    createdAt
                }
            }
        `;

    const getNFTByIdQuery = `
            query getNFTById($id: String!) {
                getNFTById(id: $id) {
                    id
                    title
                    shortDescription
                    createdAt
                }
            }
        `;

    const updateNFTMutation = `
        mutation updateNFTMutation($id: String!, $options: UpdateNFTInput!) {
            updateNFTById(id: $id, options: $options)
        }
    `;

    const deleteNFTMutation = `
        mutation deleteNFTMutation($id: String!) {
            deleteNFTById(id: $id)
        }
    `;

    it('should create a NFT for the currently logged in user', async () => {
        // Register a user
        await callGraphQL({
            source: registerMutation,
            variableValues: { options: userData[0] },
        });

        // Get a user
        const getUsersResponse = await callGraphQL({
            source: getUsersQuery,
        });

        const { id } = getUsersResponse?.data?.getUsers[0];

        const createNFTMutation = `
            mutation createNFTMutation($options: CreateNFTInput!) {
                createNFT(options: $options) {
                    id
                    title
                    shortDescription
                    createdAt
                }
            }
        `;

        const createNFTResponse = await callGraphQL({
            source: createNFTMutation,
            variableValues: { options: nftData },
            userId: id,
        });

        expect(createNFTResponse?.data?.createNFT).toBeDefined();
        expect(createNFTResponse?.data?.createNFT).toHaveProperty(
            'title',
            nftData.title
        );
        expect(createNFTResponse?.data?.createNFT).toHaveProperty('createdAt');
    });

    it('should query a list of all NFTs', async () => {
        const getNFTsResponse = await callGraphQL({
            source: getAllNFTsQuery,
        });

        expect(getNFTsResponse?.data?.getAllNFTs).toBeDefined();
        expect(getNFTsResponse?.data?.getAllNFTs).toHaveLength(1);
        expect(getNFTsResponse?.data?.getAllNFTs[0]).toHaveProperty(
            'title',
            nftData.title
        );
        expect(getNFTsResponse?.data?.getAllNFTs[0]).toHaveProperty(
            'shortDescription',
            nftData.shortDescription
        );
        expect(getNFTsResponse?.data?.getAllNFTs[0]).toHaveProperty(
            'createdAt'
        );
    });

    it('should query a list of all NFTs for a specific user', async () => {
        // Get a user
        const getUsersResponse = await callGraphQL({
            source: getUsersQuery,
        });

        const { id } = getUsersResponse?.data?.getUsers[0];

        const getNFTsByUserIdQuery = `
            query getNFTsByUserId($userId: String!) {
                getNFTsByUserId(userId: $userId) {
                    id
                    title
                    shortDescription
                    createdAt
                }
            }
        `;

        const getNFTsByUserIdResponse = await callGraphQL({
            source: getNFTsByUserIdQuery,
            variableValues: { userId: id },
        });

        expect(getNFTsByUserIdResponse.data?.getNFTsByUserId).toBeDefined();
        expect(getNFTsByUserIdResponse.data?.getNFTsByUserId).toHaveLength(1);
    });

    it('should query a specific NFT by its ID', async () => {
        const getAllNFTSResponse = await callGraphQL({
            source: getAllNFTsQuery,
        });

        const { id } = getAllNFTSResponse?.data?.getAllNFTs[0];

        const getNFTByIdResponse = await callGraphQL({
            source: getNFTByIdQuery,
            variableValues: { id },
        });

        expect(getNFTByIdResponse.data?.getNFTById).toBeDefined();
        expect(getNFTByIdResponse.data?.getNFTById).toHaveProperty(
            'title',
            nftData.title
        );
    });

    it('should throw an error if NFT with specified ID does not exist', async () => {
        // Get a user
        const getUsersResponse = await callGraphQL({
            source: getUsersQuery,
        });

        const userId = getUsersResponse?.data?.getUsers[0].id;

        const getNFTByIdResponse = await callGraphQL({
            source: getNFTByIdQuery,
            variableValues: { id: '0854c9bb-3789-4346-91ad-10c396a7d90b' },
        });

        const updateNFTByIdResponse = await callGraphQL({
            source: updateNFTMutation,
            variableValues: {
                id: '0854c9bb-3789-4346-91ad-10c396a7d90b',
                options: updateNFTData,
            },
            userId,
        });

        const deleteNFTByIdResponse = await callGraphQL({
            source: deleteNFTMutation,
            variableValues: { id: '0854c9bb-3789-4346-91ad-10c396a7d90b' },
            userId,
        });

        expect(getNFTByIdResponse.errors).toBeDefined();
        expect(getNFTByIdResponse.errors?.[0].message).toBe(
            'NFT with provided ID does not exist'
        );
        expect(updateNFTByIdResponse.errors?.[0].message).toBe(
            'NFT with provided ID does not exist'
        );
        expect(deleteNFTByIdResponse.errors?.[0].message).toBe(
            'NFT with provided ID does not exist'
        );
    });

    it('should query all NFTs with the specified category', async () => {
        const getNFTsByCategoryQuery = `
            query getNFTsByCategory($category: String!) {
                getNFTsByCategory(category: $category) {
                    id
                    title
                    shortDescription
                    createdAt
                }
            }
        `;

        const getNFTsByCategoryResponse = await callGraphQL({
            source: getNFTsByCategoryQuery,
            variableValues: { category: 'Art' },
        });

        expect(getNFTsByCategoryResponse.data?.getNFTsByCategory).toBeDefined();
        expect(getNFTsByCategoryResponse.data?.getNFTsByCategory).toHaveLength(
            1
        );
        expect(
            getNFTsByCategoryResponse.data?.getNFTsByCategory[0]
        ).toHaveProperty('title', nftData.title);
    });

    it('should update a NFT with specified ID and provided information', async () => {
        // Get a NFT
        const getAllNFTSResponse = await callGraphQL({
            source: getAllNFTsQuery,
        });

        const nftId = getAllNFTSResponse?.data?.getAllNFTs[0].id;

        // Get a user
        const getUsersResponse = await callGraphQL({
            source: getUsersQuery,
        });

        const userId = getUsersResponse?.data?.getUsers[0].id;

        const updateNFTResponse = await callGraphQL({
            source: updateNFTMutation,
            variableValues: { id: nftId, options: updateNFTData },
            userId: userId,
        });

        const getNFTByIdResponse = await callGraphQL({
            source: getNFTByIdQuery,
            variableValues: { id: nftId },
        });

        expect(updateNFTResponse.data?.updateNFTById).toBe(true);
        expect(getNFTByIdResponse.data?.getNFTById).toHaveProperty(
            'title',
            updateNFTData.title
        );
    });

    it('should throw an error user is not authorized to update the specified NFT', async () => {
        // Register a user
        await callGraphQL({
            source: registerMutation,
            variableValues: { options: userData[1] },
        });

        // Get a user
        const getUsersResponse = await callGraphQL({
            source: getUsersQuery,
        });

        const userId = getUsersResponse?.data?.getUsers[1].id;

        // Get a NFT
        const getAllNFTSResponse = await callGraphQL({
            source: getAllNFTsQuery,
        });

        const nftId = getAllNFTSResponse?.data?.getAllNFTs[0].id;

        const updateNFTResponse = await callGraphQL({
            source: updateNFTMutation,
            variableValues: { id: nftId, options: updateNFTData },
            userId: userId,
        });

        expect(updateNFTResponse.errors).toBeDefined();
        expect(updateNFTResponse.errors?.[0].message).toBe(
            'User is not authorized to edit this NFT'
        );
    });

    it('should throw an error user is not authorized to delete the specified NFT', async () => {
        // Get a user
        const getUsersResponse = await callGraphQL({
            source: getUsersQuery,
        });

        const userId = getUsersResponse?.data?.getUsers[1].id;

        // Get a NFT
        const getAllNFTSResponse = await callGraphQL({
            source: getAllNFTsQuery,
        });

        const nftId = getAllNFTSResponse?.data?.getAllNFTs[0].id;

        const deleteNFTResponse = await callGraphQL({
            source: deleteNFTMutation,
            variableValues: { id: nftId },
            userId: userId,
        });

        expect(deleteNFTResponse.errors).toBeDefined();
        expect(deleteNFTResponse.errors?.[0].message).toBe(
            'User is not authorized to delete this NFT'
        );
    });

    it('should delete the NFT with the specified ID', async () => {
        // Get a user
        const getUsersResponse = await callGraphQL({
            source: getUsersQuery,
        });

        const userId = getUsersResponse?.data?.getUsers[0].id;

        // Get a NFT
        const getAllNFTSResponse = await callGraphQL({
            source: getAllNFTsQuery,
        });

        const nftId = getAllNFTSResponse?.data?.getAllNFTs[0].id;

        const deleteNFTResponse = await callGraphQL({
            source: deleteNFTMutation,
            variableValues: { id: nftId },
            userId: userId,
        });

        expect(deleteNFTResponse.data?.deleteNFTById).toBe(true);
    });
});
