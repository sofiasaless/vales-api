import { FieldValue } from "firebase-admin/firestore";
import { IncentiveBonus } from "../../../entities/employee.entity";
import { COLLECTIONS } from "../../../enum/collections.enum";
import { PatternService } from "../../common/pattern.service";
import {
  AddEmployeeIncentiveBonusDto,
  RemoveEmployeeIncentiveBonusDto,
} from "../dto/addEmployeeIncentiveBonus.dto";

export class EmployeeIncentiveService extends PatternService {
  constructor() {
    super(COLLECTIONS.FUNCIONARIOS);
  }

  async addIncentiveBonus(
    employeeId: string,
    payload: AddEmployeeIncentiveBonusDto,
  ) {
    const incentiveBonusToSave: IncentiveBonus = {
      ...payload,
      id: crypto.randomUUID(),
      data: new Date().toISOString(),
    };
    await this.setup()
      .doc(employeeId)
      .update({
        incentivo: FieldValue.arrayUnion(incentiveBonusToSave),
      });
  }

  async removeIncentiveBonus(
    employeeId: string,
    payload: RemoveEmployeeIncentiveBonusDto,
  ) {
    const { ...plainObject } = payload;
    await this.setup()
      .doc(employeeId)
      .update({
        incentivo: FieldValue.arrayRemove(plainObject),
      });
  }
}

export const employeeIncentiveBonusService = new EmployeeIncentiveService();
