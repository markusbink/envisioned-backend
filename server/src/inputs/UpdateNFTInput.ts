import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateNFTInput {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    shortDescription?: string;

    @Field({ nullable: true })
    longDescription?: string;

    @Field({ nullable: true })
    category?: string;

    @Field({ nullable: true })
    imageURI?: string;

    @Field({ nullable: true })
    sourceURI?: string;
}
