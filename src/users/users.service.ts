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

  create(email: string, password: string) {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  async findOne(id: number) {
    if (!id) return null;
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new NotFoundException(`User with id:${id} does not exist!`);
    return user;
  }

  async find(email: string) {
    const [user] = await this.userRepository.find({
      where: { email },
      // relations: { /* relations */ }
    });

    // if (!user)
    //  throw new NotFoundException(`A user with email ${email} not found`);
    return user;
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`A user with id ${id} not found`);
    Object.assign(user, body);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    // const user = await this.userRepository.findOneBy({ id });
    // return this.userRepository.remove(user);
    //
    // using a more effecient way and not benefiting from hooks
    // we will use the dlete method instead of find then remove methods
    return this.userRepository.delete(id);
  }
}
