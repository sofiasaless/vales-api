import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from "class-validator";
import { EmployeeTypes } from "../../../enum/employee.enum";
import { EmployeeContract, Voucher } from "../../../entities/employee.entity";

export class CreateEmployeeDto {
  @IsString()
  nome: string;

  @IsNumber()
  @IsPositive()
  salario: number;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsString()
  cargo: string;

  @IsEnum({ enum: EmployeeTypes })
  tipo: EmployeeTypes;

  @IsOptional()
  dias_trabalhados_semanal?: number;

  @IsOptional()
  @IsUrl()
  foto_url?: string;

  @IsDateString()
  @IsOptional()
  data_nascimento?: string;

  @IsDateString()
  data_admissao: string;

  @IsNumber()
  primeiro_dia_pagamento: number;

  @IsNumber()
  segundo_dia_pagamento: number;

  @IsObject()
  contrato?: EmployeeContract;
}
