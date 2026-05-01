import { IsArray, IsObject, IsString } from "class-validator";
import { Voucher } from "../../../entities/employee.entity";

export class AddEmployeeMultipleVouchersDto {
  @IsArray()
  vales: Voucher[];
}

export class AddEmployeeSingleVouchersDto {
  @IsObject()
  vale: Voucher;
}
