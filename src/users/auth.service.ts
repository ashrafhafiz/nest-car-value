import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as argon from 'argon2';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(body: CreateUserDto) {
    const existingUser = await this.usersService.find(body.email);
    console.log(existingUser);

    if (existingUser)
      throw new BadRequestException(`Supplied email is in use!`);

    const hash = await argon.hash(body.password);
    const newUser = await this.usersService.create(body.email, hash);

    return newUser;
  }

  async signin(body: CreateUserDto) {
    const existingUser = await this.usersService.find(body.email);
    console.log(existingUser);

    if (!existingUser)
      throw new BadRequestException(`Supplied email does not exist!`);

    const passwordMatch = await argon.verify(
      existingUser.password,
      body.password,
    );

    if (!passwordMatch) {
      throw new ForbiddenException(`Invalid credentials`);
    }

    return existingUser;
  }
}
