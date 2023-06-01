import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum Statuses {
  OPEN,
  ORDERED,
}

export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};

export type CartItem = {
  product: Product,
  count: number,
}

export type Cart = {
  id: string,
  items: CartItem[],
}
