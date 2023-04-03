import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @MinLength(1)
  @IsNotEmpty()
  job: string;

  @MinLength(1)
  @IsNotEmpty()
  name: string;
}
