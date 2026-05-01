import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";
import { InternUserTypes } from "../../../enum/internUser.enum";

export class UpdateInternUserDto {
  @IsString()
  @IsOptional()
  nome: string;

  @IsEnum({ enum: InternUserTypes })
  @IsOptional()
  tipo: InternUserTypes;

  @IsString()
  @MinLength(4)
  @IsOptional()
  senha: string;

  @IsOptional()
  @IsUrl()
  img_perfil: string;
}
