import { Field, ObjectType, ID } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '.';

@Entity()
@ObjectType()
export class NFT extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column({ name: 'short_description' })
    shortDescription: string;

    @Field()
    @Column({ name: 'long_description' })
    longDescription: string;

    @Field()
    @Column()
    category: string;

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
    @Column()
    creatorId: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.nfts, { onDelete: 'CASCADE' })
    creator: User;

    @ManyToMany(() => User, { nullable: true })
    @JoinTable()
    upvotes?: User[];

    @ManyToMany(() => User, { nullable: true })
    @JoinTable()
    favorites?: User[];
}
