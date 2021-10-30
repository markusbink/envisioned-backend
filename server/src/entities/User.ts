import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { NFT } from '.';

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => NFT, (nft) => nft.creator, { nullable: true })
    nfts: NFT[];
}
