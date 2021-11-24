import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { Profile } from '../entities';
import { CreateProfileInput, UpdateProfileInput } from '../inputs';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { ApolloContext } from '../types';

@Resolver()
export class ProfileResolver {
    /**
     * Returns the profile data of the currently logged in user.
     * @param context ApolloContext
     * @returns Profile of user
     */
    @Query(() => Profile)
    @UseMiddleware(isAuthenticated)
    async getProfile(@Ctx() { req }: ApolloContext) {
        const profile = await Profile.findOne({
            where: { creatorId: req.session!.userId },
        });

        if (!profile) {
            throw new Error('Profile not found');
        }

        return profile;
    }

    /**
     * Creates a new profile for the currently logged in user
     * @param options Inputs to create a new Profile
     * @param context ApolloContext
     * @returns Profile of user
     */
    @Mutation(() => Profile)
    @UseMiddleware(isAuthenticated)
    async createProfile(
        @Arg('options') options: CreateProfileInput,
        @Ctx() { req }: ApolloContext
    ) {
        const profile = Profile.create({
            ...options,
            creatorId: req.session!.userId,
        }).save();

        return profile;
    }

    /**
     * Updates the profile data of the currently logged in user
     * @param options Inputs to update the Profile
     * @param context ApolloContext
     * @returns Boolean wheter the update was successful
     */
    @Mutation(() => Profile)
    @UseMiddleware(isAuthenticated)
    async updateProfile(
        @Arg('options') options: UpdateProfileInput,
        @Ctx() { req }: ApolloContext
    ) {
        const profile = await Profile.findOne({
            creatorId: req.session!.userId,
        });

        if (!profile) {
            throw new Error('NFT with provided ID does not exist');
        }

        if (profile.creatorId !== req.session.userId) {
            throw new Error('User is not authorized to edit this NFT');
        }

        await Profile.update({ creatorId: req.session!.userId }, options);
        return true;
    }
}
