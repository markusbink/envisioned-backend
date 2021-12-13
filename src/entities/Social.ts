import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '.';
import { Social as SocialType } from '../types';

@ObjectType()
@Entity()
export class Social {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    name: SocialType;

    @Field()
    @Column()
    url: string;

    @Field(() => Profile)
    @ManyToOne(() => Profile, (profile) => profile.socials, {
        onDelete: 'CASCADE',
    })
    profile: Profile;
}
