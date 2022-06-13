import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(body: CreateUserDto) {
    const user = this.userRepository.create({
      email: body.email,
      password: body.password,
    });
    return this.userRepository.save(user);
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  find(email: string) {
    return this.userRepository.find({
      where: { email },
      // relations: { /* relations */ }
    });
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`A user with id ${id} not found`);
    Object.assign(user, body);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return this.userRepository.remove(user);
  }
}
