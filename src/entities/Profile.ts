import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Social, User } from '.';

@Entity()
@ObjectType()
export class Profile extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ nullable: true })
    bio?: string;

    @Field()
    @Column({ nullable: true })
    profileImageURI?: string;

    @Field()
    @Column()
    creatorId: string;

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    creator: User;

    @Field(() => Social)
    @OneToMany(() => Social, (social) => social.profile, { nullable: true })
    socials?: Social[];
}
