import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { v4 as uuidv4 } from 'uuid';

import { User } from '../../database/entities';

export class CreateUserDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async findOne(userId: string): Promise<User> {
    return this.users.findOneBy({ id: userId });
  }

  async findByUserNameAndPassword(name: string, password: string): Promise<User> {
    return this.users.findOneBy({ name, password });
  }

  async createOne({ name, password, email }: CreateUserDTO): Promise<User> {
    const newUser = await this.users.save({
      name,
      email,
      password,
    });

    return newUser;
  }

}
