import { IsUrl, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateProfileInput {
    @Field({ nullable: true })
    @Length(0, 255, { message: 'Bio must be between 0 and 255 characters' })
    bio?: string;

    @Field({ nullable: true })
    @IsUrl({}, { message: 'Profile image must be a valid URL' })
    profileImageURI?: string;
}
