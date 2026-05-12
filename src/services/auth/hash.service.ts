import bcrypt from "bcryptjs";

export class HashService {
  encode(value: string) {
    return bcrypt.hashSync(value, 12);
  }

  verifyMatch(value: string, encodedValue: string) {
    return bcrypt.compareSync(value, encodedValue);
  }
}

export const hashService = new HashService();
