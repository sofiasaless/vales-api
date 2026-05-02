import { IsNotEmpty, IsString } from "class-validator";

export class LoginInternUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
