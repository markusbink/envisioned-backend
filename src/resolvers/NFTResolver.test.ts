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
    const userData = {
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'johndoepassword',
    };

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

    it('should create a NFT for the currently logged in user', async () => {
        // Register a user
        await callGraphQL({
            source: registerMutation,
            variableValues: { options: userData },
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
});
