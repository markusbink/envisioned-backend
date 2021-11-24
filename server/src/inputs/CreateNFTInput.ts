import { IsString, IsUrl, Length, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateNFTInput {
    @Field()
    @Length(10, 255, { message: 'Title must be between 10 and 255 characters' })
    title: string;

    @Field()
    @Length(10, 70, {
        message: 'Short description must be between 10 and 70 characters',
    })
    shortDescription: string;

    @Field()
    @Length(10, 255, {
        message: 'Long description must be between 10 and 255 characters',
    })
    longDescription: string;

    @Field()
    @IsString({ message: 'Category must be a string' })
    category: string;

    @Field()
    @IsUrl({}, { message: 'Invalid url' })
    imageURI: string;

    @Field()
    @IsUrl({}, { message: 'Invalid url' })
    sourceURI: string;
}
