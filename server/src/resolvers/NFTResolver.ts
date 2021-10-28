import { CreateNFTInput, UpdateNFTInput } from '../inputs';
import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { NFT } from '../entities';

@Resolver(NFT)
export class NFTResolver {
    /**
     * Get all NFTs in the database
     * @returns NFTs
     */
    @Query(() => [NFT])
    async getAllNFTs() {
        const nfts = await NFT.find();
        return nfts;
    }

    /**
     * Returns NFT with the given ID
     * @param id ID of the NFT
     * @returns The NFT with the given ID
     */
    @Query(() => NFT, { nullable: true })
    async getNFTById(@Arg('id', () => Int) id: number): Promise<NFT | null> {
        const nft = await NFT.findOne(id);
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
    @Query(() => [NFT])
    async getNFTsByCreatorId(
        @Arg('creatorId', () => String) creatorId: string
    ) {
        const nfts = await NFT.find({ creatorId });
        return nfts;
    }

    /**
     * Create a new NFT with the given options
     * @param options Inputs to create a new NFT
     * @returns A new NFT
     */
    @Mutation(() => NFT)
    async createNFT(
        @Arg('options', () => CreateNFTInput) options: CreateNFTInput
    ): Promise<NFT> {
        const nft = await NFT.create(options).save();
        return nft;
    }

    /**
     *
     * @param id ID of the NFT
     * @param options Inputs to update a NFT
     * @returns Boolean whether operation was successful or not
     */
    @Mutation(() => Boolean)
    async updateNFT(
        @Arg('id', () => Int) id: number,
        @Arg('options', () => UpdateNFTInput) options: UpdateNFTInput
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
    async deleteNFT(@Arg('id', () => Int) id: number): Promise<Boolean> {
        await NFT.delete({ id });
        return true;
    }
}
