import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from "class-validator";

export class CreateEnterpriseDto {
  @IsString()
  nome_fantasia: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsPositive()
  valor_plano: number;

  @IsNumber()
  @IsPositive()
  dia_pagamento: number;

  @IsString()
  link_padrao: string;
}

export class CreateAuthEnterpriseDto extends CreateEnterpriseDto {
  @IsString()
  @MinLength(6)
  senha: string;
}
