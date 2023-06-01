import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Order } from '../../database/entities';
import { Payment, Delivery } from '../../database/entities/order';

export class OrderDTO {
  @ApiProperty()
  userId?: string;

  @ApiProperty()
  payment?: Payment;

  @ApiProperty()
  delivery?: Delivery;

  @ApiProperty()
  comments?: string;

  total?: number;

  cartId?: string;
};

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
  ) {}

  async findById(orderId: string): Promise<Order> {
    return this.orders.findOneBy({ id: orderId });
  }

  async create({
    userId,
    payment,
    delivery,
    comments,
    total,
    cartId,
  }: Required<OrderDTO>) {
    const order = await this.orders.save({
      payment,
      delivery,
      comments,
      total,
      cart: { id: cartId },
      user: { id: userId },
    }, { reload: true });

    return order;
  }

  async update(
    orderId: string,
    {
      payment,
      delivery,
      comments,
      total,
    }: OrderDTO,
  ): Promise<Order> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    const updatedOrder = await this.orders.save({
      id: orderId,
      ...(payment && { payment }),
      ...(delivery && { delivery }),
      ...(comments && { comments }),
      ...(total && { total }),
    }, { reload: true });

    return updatedOrder;
  }
}
