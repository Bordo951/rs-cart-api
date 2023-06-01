import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  UseGuards,
  HttpStatus,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

import {
  BasicAuthGuard,
  // JwtAuthGuard,
} from '../auth';
import { OrderDTO } from '../order/services/order.service';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartItem, Order } from '../database/entities';

import { calculateCartTotal } from './models-rules';
import { CartService, CreateCartItemDTO } from './services';

@ApiTags('carts')
@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private dataSource: DataSource,
  ) { }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', '*')
  @Header('Access-Control-Allow-Methods', '*')
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateByUserId('user1');

    return { cart, total: calculateCartTotal(cart) }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', '*')
  @Header('Access-Control-Allow-Methods', '*')
  @ApiBody({ type: [CreateCartItemDTO] })
  async updateUserCart(@Req() req: AppRequest, @Body() body: CreateCartItemDTO[]) { // TODO: validate body payload...
    const cart = await this.cartService.updateByUserId('user1', { items: body })

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal({ ...cart }),
      }
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', '*')
  @Header('Access-Control-Allow-Methods', '*')
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId('user1');

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', '*')
  @Header('Access-Control-Allow-Methods', '*')
  @ApiBody({ type: OrderDTO })
  async checkout(
    @Req() req: AppRequest,
    @Body() {
      // userId,
      payment,
      delivery,
      comments,
    }: Omit<Required<OrderDTO>, 'total'>,
  ) {
    const cart = await this.cartService.findByUserId('user1');

    if (!(cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let order: Order;
    try {
      order = await queryRunner.manager.save(
        Order, {
          user: { id: 'user1' },
          payment,
          delivery,
          comments,
          total,
          cart: { id: cartId },
        },
      );

      await queryRunner.manager.delete(CartItem, { cart: { id: cartId } });

      await queryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order }
      };
    } catch(e) {
      await queryRunner.rollbackTransaction();

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      };
    } finally {
      await queryRunner.release();
    }
  }
}
