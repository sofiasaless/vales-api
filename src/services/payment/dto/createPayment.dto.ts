import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from "class-validator";
import { Voucher } from "../../../entities/employee.entity";

export class CreatePaymentDto {
  @IsNumber()
  valor_pago: number;

  @IsNumber()
  @IsPositive()
  salario_atual: number;

  @IsArray()
  vales: Voucher[];

  @IsArray()
  incentivo: [];

  @IsUrl()
  @IsOptional()
  assinatura?: string;
}
