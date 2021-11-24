import { IsString, IsUrl, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateNFTInput {
    @Field({ nullable: true })
    @Length(10, 255, { message: 'Title must be between 10 and 255 characters' })
    title?: string;

    @Field({ nullable: true })
    @Length(10, 70, {
        message: 'Short description must be between 10 and 70 characters',
    })
    shortDescription?: string;

    @Field({ nullable: true })
    @Length(10, 255, {
        message: 'Long description must be between 10 and 255 characters',
    })
    longDescription?: string;

    @Field({ nullable: true })
    @IsString({ message: 'Category must be a string' })
    category?: string;

    @Field({ nullable: true })
    @IsUrl({}, { message: 'Invalid url' })
    imageURI?: string;

    @Field({ nullable: true })
    @IsUrl({}, { message: 'Invalid url' })
    sourceURI?: string;
}
