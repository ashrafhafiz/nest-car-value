import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
// import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UsersService } from './users.service';

@Controller('users/auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    // return this.usersService.create(body);
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body);
    session.userId = user.id;
    return user;
  }

  // @Get('whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }

  // In case of using only interceptor
  // @Get('whoami')
  // whoAmI(@Request() request: Request) {
  //   return request.currentUser;
  // }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  // ParseIntPipe is not required. It is for education purpose only.
  // GlobalPipe is used with VlidationPipe option transform: true.
  //
  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(SerializeInterceptor)
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    // console.log(`This is the handler`);
    const user = await this.usersService.findOne(id);
    return user;
  }

  @Get('')
  findUserByEmail(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
