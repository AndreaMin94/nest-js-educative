/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  @Column()
  id!: number;

  @Column()
  addressLine!: string;

  @Column()
  postCode!: string;

  @Column()
  state!: string;

  @Column()
  createdDate!: Date;
}
