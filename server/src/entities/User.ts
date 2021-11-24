import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { NFT, Profile } from '.';

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

    @OneToOne(() => Profile, (profile) => profile.creator, { nullable: true })
    profile?: Profile;

    @OneToMany(() => NFT, (nft) => nft.creator, { nullable: true })
    nfts?: NFT[];
}
