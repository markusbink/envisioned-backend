import { Field, InputType } from 'type-graphql';
import { User } from '../entities';

@InputType()
export class CreateNFTInput {
    @Field()
    title: string;

    @Field()
    shortDescription: string;

    @Field()
    longDescription: string;

    @Field()
    category: string;

    @Field()
    imageURI: string;

    @Field()
    sourceURI: string;
}
