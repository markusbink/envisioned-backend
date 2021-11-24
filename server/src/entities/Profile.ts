import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '.';

@Entity()
@ObjectType()
export class Profile {
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

    @OneToOne(() => User, (user) => user.profile)
    creator: User;
}
