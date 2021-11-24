import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterUserInput {
    @Field()
    @MinLength(3, { message: 'Username must be at least 3 characters' })
    username: string;

    @Field()
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;

    @Field()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;
}
