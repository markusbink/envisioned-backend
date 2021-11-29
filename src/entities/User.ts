import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
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

    @Field(() => Profile)
    @OneToOne(() => Profile, (profile) => profile.creator)
    profile: Profile;

    @OneToMany(() => NFT, (nft) => nft.creator, { nullable: true })
    nfts?: NFT[];
}
