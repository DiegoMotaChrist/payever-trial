import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CreateUserCase } from 'src/app/use-cases/create-user.case';
import { CreateUserDTO } from 'src/infra/http/dtos/create-user.dto';
import { UserViewModel } from 'src/infra/http/view-models/user.view-model';
import { FindByIdCase } from 'src/app/use-cases/find-by-id.case';
import { DeleteUserCase } from 'src/app/use-cases/delete-user.case';
import { FindAvatarByUserCase } from 'src/app/use-cases/find-avatar-by-user.case';
import { UserAvatarModel } from '../view-models/user-avatar.view-model';

@Controller('user')
export class UserController {
  constructor(
    private createUserCase: CreateUserCase,
    private findByIdCase: FindByIdCase,
    private deleteUserCase: DeleteUserCase,
    private findAvatarByUserCase: FindAvatarByUserCase,
  ) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    const { job, name } = body;
    const { user } = await this.createUserCase.execute({ job, name });

    return {
      user: UserViewModel.toHTTP(user),
    };
  }

  @Get('/:userId')
  async findById(@Param('userId') userId: string) {
    const { user } = await this.findByIdCase.execute({
      userId,
    });

    return {
      user: UserViewModel.toHTTPFromAPI(user),
    };
  }

  @Get(':userId/avatar')
  async findAvatarByUser(@Param('userId') userId: string) {
    const { file, base64 } = await this.findAvatarByUserCase.execute({
      userId,
    });

    return {
      userAvatar: UserAvatarModel.toHTTP({ file, base64 }),
    };
  }

  @Delete(':userId/avatar')
  async delete(@Param('userId') userId: string) {
    return await this.deleteUserCase.execute({ userId });
  }
}
