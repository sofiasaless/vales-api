import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
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

  // incentivo: GanhosIncentivo[];

  @IsUrl()
  @IsOptional()
  assinatura?: string;
}
