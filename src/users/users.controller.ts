import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users/auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {}

  //   @Get('/email')
  //   findAllUsers(@Query()) {}

  @Patch('/:id')
  updateUser(@Param('id') id: string) {}

  @Delete('/:id')
  removeUser(@Param('id') id: string) {}
}
