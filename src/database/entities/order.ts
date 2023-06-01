import { ApiProperty } from '@nestjs/swagger';

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Cart } from './cart';
import { User } from './user';

export class Payment {
  @ApiProperty()
  type: string;
  
  @ApiProperty()
  address?: string;
  
  @ApiProperty()
  creditCard?: string;
};

export class Delivery {
  @ApiProperty()
  type: string;

  @ApiProperty()
  address: string;
};

export enum OrderStatuses {
  IN_PROGRESS,
  ORDERED,
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: false  })
  payment: Payment;

  @Column({ type: 'json', nullable: false })
  delivery: Delivery;

  @Column({ type: 'text' })
  comments: string;

  @Column({ type: 'enum', nullable: false, enum: OrderStatuses })
  status: OrderStatuses;

  @Column({ type: 'numeric', nullable: false })
  total: number;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: Cart;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
