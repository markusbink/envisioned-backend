import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @MinLength(3, { message: 'Username must be at least 3 characters' })
    username: string;

    @Field({ nullable: true })
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;
}
