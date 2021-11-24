import * as argon2 from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entities';
import {
    LoginUserInput,
    RegisterUserInput,
    UpdatePasswordInput,
    UpdateUserInput,
} from '../inputs';
import { ApolloContext } from '../types';

@Resolver(User)
export class UserResolver {
    /**
     * Get a single user by id
     * @param id ID of user
     * @returns User with specified ID
     */
    @Query(() => User, { nullable: true })
    async getUser(@Arg('id') id: string): Promise<User | undefined> {
        return await User.findOne({ id });
    }

    /**
     * Get all users in the database
     * @returns A list of all users
     */
    @Query(() => [User], { nullable: true })
    async getUsers(): Promise<User[] | null> {
        return await User.find();
    }

    /**
     * Gets currently logged in user
     * @param context Context of the request
     * @returns User with specified ID
     */
    @Query(() => User, { nullable: true })
    async currentUser(
        @Ctx() { req }: ApolloContext
    ): Promise<User | undefined> {
        if (!req.session.userId) {
            return undefined;
        }

        return await User.findOne({ id: req.session.userId });
    }

    /**
     * Register a user with specified options
     * @param options Object with user information
     * @param context Context of the request
     * @returns A new user
     */
    @Mutation(() => User)
    async register(
        @Arg('options') options: RegisterUserInput,
        @Ctx() { req }: ApolloContext
    ): Promise<User> {
        // Check if user already exists
        const user = await User.findOne({
            where: [{ username: options.username }, { email: options.email }],
        });

        if (user) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await argon2.hash(options.password);

        const newUser = await User.create({
            ...options,
            password: hashedPassword,
        }).save();

        // Store user id in session
        req.session.userId = newUser.id;

        return newUser;
    }

    /**
     * Login a user with specified options
     * @param options Object with user information
     * @returns User with specified information
     */
    @Mutation(() => User)
    async login(
        @Arg('options') options: LoginUserInput,
        @Ctx() { req }: ApolloContext
    ): Promise<User | undefined> {
        const user = await User.findOne({ where: { email: options.email } });
        if (!user) {
            throw new Error('User does not exists');
        }

        const isValid = await argon2.verify(user.password, options.password);

        if (!isValid) {
            throw new Error('Invalid password');
        }

        // Store user id in session
        req.session.userId = user.id;

        // User exists and is validated
        return user;
    }

    /**
     * Updates the password of user with given ID
     * @param id ID of user
     * @param options Fields to update (oldPassword, newPassword)
     * @returns Boolean whether the update was successful
     */
    @Mutation(() => Boolean)
    async updatePassword(
        @Arg('id') id: string,
        @Arg('options') options: UpdatePasswordInput
    ): Promise<Boolean> {
        const user = await User.findOne({ id });

        if (!user) {
            throw new Error('User does not exists');
        }

        const hashedNewPassword = await argon2.hash(options.newPassword);

        if (!(await argon2.verify(user.password, options.oldPassword))) {
            throw new Error('Invalid old password');
        }

        if (await argon2.verify(user.password, options.newPassword)) {
            throw new Error('New password must be different from old password');
        }

        await User.update({ id }, { password: hashedNewPassword });

        return true;
    }

    /**
     * Updates username or email of user
     * @param id ID of user
     * @param options Fields to update (username, email)
     * @returns Boolean whether the update was successful
     */
    @Mutation(() => Boolean)
    async updateUserInfo(
        @Arg('id') id: string,
        @Arg('options') options: UpdateUserInput
    ): Promise<Boolean> {
        const user = await User.findOne({ id });
        if (!user) {
            throw new Error('User does not exists');
        }

        const userWithUsername = await User.findOne({
            where: { username: options.username },
        });
        if (userWithUsername) {
            throw new Error('Username already exists');
        }

        const userWithEmail = await User.findOne({
            where: { email: options.email },
        });
        if (userWithEmail) {
            throw new Error('User with email already exists');
        }

        await User.update({ id }, { ...options });
        return true;
    }

    /**
     * Delete a user with specified id
     * @param id ID of the user
     * @returns Boolean whether operation was successful or not
     */
    @Mutation(() => Boolean)
    async deleteUser(@Arg('id') id: string): Promise<boolean> {
        await User.delete({ id });
        return true;
    }
}
