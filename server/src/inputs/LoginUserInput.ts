import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginUserInput {
    @Field()
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;

    @Field()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;
}
