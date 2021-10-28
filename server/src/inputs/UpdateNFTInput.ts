import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateNFTInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    image_uri?: string;

    @Field({ nullable: true })
    source_uri?: string;
}
