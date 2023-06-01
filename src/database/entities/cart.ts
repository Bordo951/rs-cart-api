import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CartItem } from './cartItem';
import { User } from './user';

export enum Statuses {
  OPEN,
  ORDERED,
}

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: false, name: 'created_at' })
  createdAt: string;

  @Column({ type: 'date', nullable: false, name: 'updated_at' })
  updatedAt: string;

  @Column({ type: 'enum', nullable: false, enum: Statuses })
  status: Statuses;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
