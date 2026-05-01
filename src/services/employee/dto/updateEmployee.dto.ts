import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from "class-validator";
import { EmployeeTypes } from "../../../enum/employee.enum";

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  nome: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  salario: number;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsString()
  @IsOptional()
  cargo: string;

  @IsEnum({ enum: EmployeeTypes })
  @IsOptional()
  tipo: EmployeeTypes;

  @IsOptional()
  @IsOptional()
  dias_trabalhados_semanal?: number;

  @IsOptional()
  @IsUrl()
  foto_url?: string;

  @IsDateString()
  @IsOptional()
  data_nascimento?: string;

  @IsDateString()
  @IsOptional()
  data_admissao: string;

  @IsNumber()
  @IsOptional()
  primeiro_dia_pagamento: number;

  @IsNumber()
  @IsOptional()
  segundo_dia_pagamento: number;
}
