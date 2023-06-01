import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategy';
import { Cart, CartItem, Order, User } from './entities';
import dotenv from 'dotenv';

dotenv.config();

console.log('DBHOST: ', process.env.DB_HOST);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.DB_HOST}`,
      port: +`${process.env.DB_PORT}`,
      database: `${process.env.DB_NAME}`,
      username: `${process.env.DB_USERNAME}`,
      password: `${process.env.DB_PASSWORD}`,
      entities: [Cart, CartItem, Order],
      logging: true,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    TypeOrmModule.forFeature([Cart, CartItem, Order, User]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
