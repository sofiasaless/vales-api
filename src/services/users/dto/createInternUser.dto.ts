import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";
import { InternUserTypes } from "../../../enum/internUser.enum";

export class CreateInternUserDto {
  @IsString()
  nome: string;

  @IsEnum({ enum: InternUserTypes })
  tipo: InternUserTypes;

  @IsString()
  @MinLength(4)
  senha: string;

  @IsOptional()
  @IsUrl()
  img_perfil: string;
}
