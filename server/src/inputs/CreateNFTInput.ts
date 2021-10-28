import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateNFTInput {
    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    image_uri: string;

    @Field()
    source_uri: string;

    @Field()
    creator_id: string;
}
