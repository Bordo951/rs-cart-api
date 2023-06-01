import { ApiProperty } from '@nestjs/swagger';

export class User {
  id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email?: string;

  password?: string;
}
