import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { NFT } from '../entities';
import { CreateNFTInput, UpdateNFTInput } from '../inputs';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { ApolloContext } from '../types';
@Resolver(NFT)
export class NFTResolver {
    /**
     * Get all NFTs in the database
     * @returns NFTs
     */
    // TODO: add pagination and only load new NFTs if necessary
    @Query(() => [NFT], { nullable: true })
    async getAllNFTs(): Promise<NFT[] | null> {
        const nfts = await NFT.find({ relations: ['creator'] });
        return nfts;
    }

    /**
     * Returns NFT with the given ID
     * @param id ID of the NFT
     * @returns The NFT with the given ID
     */
    @Query(() => NFT, { nullable: true })
    async getNFTById(@Arg('id', () => String) id: string): Promise<NFT | null> {
        const nft = await NFT.findOne({
            relations: ['creator'],
            where: { id },
        });
        if (!nft) {
            throw new Error('NFT with provided ID does not exist');
        }
        return nft;
    }

    /**
     * Returns all NFTs of a creator
     * @param creatorId ID of the creator
     * @returns Array of NFTs owned by the creator
     */
    @Query(() => [NFT], { nullable: true })
    async getNFTsByUserId(
        @Arg('userId', () => String) userId: string
    ): Promise<NFT[] | null> {
        const nfts = await NFT.find({
            relations: ['creator'],
            where: { creatorId: userId },
        });
        return nfts;
    }

    /**
     * Returns all NFTs with specified category
     * @param category Category of NFTs
     * @returns Array of NFTs with the specified category
     */
    @Query(() => [NFT], { nullable: true })
    async getNFTsByCategory(
        @Arg('category', () => String) category: string
    ): Promise<NFT[] | null> {
        const nfts = await NFT.find({
            relations: ['creator'],
            where: { category },
        });
        return nfts;
    }

    /**
     * Create a new NFT with the given options
     * @param options Inputs to create a new NFT
     * @returns A new NFT
     */
    @Mutation(() => NFT)
    @UseMiddleware(isAuthenticated)
    async createNFT(
        @Arg('options', () => CreateNFTInput) options: CreateNFTInput,
        @Ctx() { req }: ApolloContext
    ): Promise<NFT> {
        const nft = await NFT.create({
            ...options,
            creatorId: req.session.userId,
        }).save();
        return nft;
    }

    /**
     * Update the NFT with the given ID
     * @param id ID of the NFT
     * @param options Inputs to update a NFT
     * @returns Boolean whether operation was successful or not
     */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuthenticated)
    async updateNFTById(
        @Arg('id') id: string,
        @Arg('options') options: UpdateNFTInput,
        @Ctx() { req }: ApolloContext
    ): Promise<Boolean> {
        const nft = await NFT.findOne(id);

        if (!nft) {
            throw new Error('NFT with provided ID does not exist');
        }

        if (nft.creatorId !== req.session.userId) {
            throw new Error('User is not authorized to edit this NFT');
        }

        await NFT.update({ id }, options);
        return true;
    }

    /**
     * Deletes NFT with the given ID
     * @param id ID of the NFT
     * @returns Boolean whether operation was successful or not
     */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuthenticated)
    async deleteNFTById(
        @Arg('id') id: string,
        @Ctx() { req }: ApolloContext
    ): Promise<Boolean> {
        const nft = await NFT.findOne(id);

        if (!nft) {
            throw new Error('NFT with provided ID does not exist');
        }

        if (nft.creatorId !== req.session.userId) {
            throw new Error('User is not authorized to delete this NFT');
        }

        await NFT.delete({ id });
        return true;
    }
}
