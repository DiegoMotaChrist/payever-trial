import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { FileModel } from 'src/database/model/file/file-model';
import { CreateUserModel } from '../database/model/user/create-user.model';
import { FindUserModel } from '../database/model/user/find-user.model';
import { UserModel } from '../database/model/user/user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindUserModel | null> {
    return this.userService.findOne(id);
  }

  @Get(':id/avatar')
  async findAvatarByUser(
    @Param('id') id: string,
  ): Promise<{ file: FileModel | null; base64: string } | { base64: string }> {
    return this.userService.findAvatarByUser(id);
  }

  @Post()
  async create(@Body() user: CreateUserModel): Promise<UserModel> {
    return this.userService.create(user);
  }

  @Delete(':id/avatar')
  async delete(@Param('id') id: string): Promise<any> {
    return this.userService.delete(id);
  }
}
