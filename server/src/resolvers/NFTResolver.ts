import { CreateNFTInput, UpdateNFTInput } from '../inputs';
import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { NFT } from '../entities';
import { StringValueNode } from 'graphql';

@Resolver(NFT)
export class NFTResolver {
    /**
     * Get all NFTs in the database
     * @returns NFTs
     */
    @Query(() => [NFT], { nullable: true })
    async getAllNFTs(): Promise<NFT[] | null> {
        const nfts = await NFT.find();
        return nfts;
    }

    /**
     * Returns NFT with the given ID
     * @param id ID of the NFT
     * @returns The NFT with the given ID
     */
    @Query(() => NFT, { nullable: true })
    async getNFTById(@Arg('id', () => String) id: string): Promise<NFT | null> {
        const nft = await NFT.findOne({ id });
        if (!nft) {
            return null;
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
            category,
        });
        return nfts;
    }

    /**
     * Create a new NFT with the given options
     * @param options Inputs to create a new NFT
     * @returns A new NFT
     */
    @Mutation(() => NFT)
    async createNFT(
        @Arg('options', () => CreateNFTInput) options: CreateNFTInput,
        @Arg('userId') userId: string
    ): Promise<NFT> {
        const nft = await NFT.create({ ...options, creatorId: userId }).save();
        return nft;
    }

    /**
     * Update the NFT with the given ID
     * @param id ID of the NFT
     * @param options Inputs to update a NFT
     * @returns Boolean whether operation was successful or not
     */
    @Mutation(() => Boolean)
    async updateNFTById(
        @Arg('id') id: string,
        @Arg('options') options: UpdateNFTInput
    ): Promise<Boolean> {
        await NFT.update({ id }, options);
        return true;
    }

    /**
     * Deletes NFT with the given ID
     * @param id ID of the NFT
     * @returns Boolean whether operation was successful or not
     */
    @Mutation(() => Boolean)
    async deleteNFTById(@Arg('id') id: string): Promise<Boolean> {
        await NFT.delete({ id });
        return true;
    }
}
