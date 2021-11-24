import { MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdatePasswordInput {
    @Field()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    oldPassword: string;

    @Field()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    newPassword: string;
}
