import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsPositive()
  @IsNumber()
  preco: number;
}
