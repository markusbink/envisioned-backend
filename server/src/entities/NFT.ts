import { Field, ObjectType, ID } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class NFT extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column({ name: 'image_uri' })
    imageURI: string;

    @Field()
    @Column({ name: 'source_uri' })
    sourceURI: string;

    @Field(() => String)
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Field()
    @Column({ name: 'creator_id' })
    creatorId: string;
}
