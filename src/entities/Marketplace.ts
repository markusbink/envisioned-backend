import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Marketplace as MarketplaceType } from '../types';

@ObjectType()
@Entity()
export class Marketplace {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    name: MarketplaceType;

    @Field()
    @Column()
    url: string;
}
