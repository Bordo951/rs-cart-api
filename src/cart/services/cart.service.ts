import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Cart, CartItem } from '../../database/entities';
import { Statuses } from '../../database/entities/cart';

export type CartDTO = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: Statuses;
  items: CartItem[];
};

export class CreateCartItemDTO {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  count: number;
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly userCarts: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItems: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string): Promise<CartDTO> {
    const cart = await this.userCarts.findOne({
      where: { user: { id: userId } },
      relations: { items: true },
    });

    return cart || null;
  }

  async createByUserId(userId: string) {
    const cart = await this.userCarts.save(
      { user: { id: userId } },
      { reload: true },
    );
    return cart;
  }

  async findOrCreateByUserId(userId: string): Promise<CartDTO> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    const cart = await this.createByUserId(userId);
    return { ...cart }
  }

  async updateByUserId(userId: string, { items }: { items: CreateCartItemDTO[] }): Promise<CartDTO> {
    const { id } = await this.findByUserId(userId);

    for (const { productId, count } of items) {
      const cartItem = await this.cartItems.findOne({
        where: {
          productId,
          cart: { id },
        },
      });

      if (!cartItem) {
        await this.cartItems.insert({ productId, count, cart: { id } });
      } else {
        if (count !== 0) {
          await this.cartItems.update(
            { id: cartItem.id },
            { count },
          );
        } else {
          await this.cartItems.delete({ cart: { id }, productId })
        }

      }
    };

    return this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    const { id } = await this.findByUserId(userId);

    await this.cartItems.delete({ cart: { id } });
  }
}
