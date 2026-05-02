import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export class HashService {
  encode(value: string) {
    return bcrypt.hashSync(value, process.env.BCRYPT_SALT);
  }

  verifyMatch(value: string, encodedValue: string) {
    return bcrypt.compareSync(value, encodedValue);
  }
}

export const hashService = new HashService();
