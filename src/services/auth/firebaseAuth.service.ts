import {
  Auth,
  CreateRequest,
  getAuth,
  UpdateRequest,
} from "firebase-admin/auth";
import { UserRole } from "./types/userRole";
import { CreateAuthUserDto } from "./dto/authUserDto";

export interface Claims {
  role: UserRole;
  active: boolean;
}

export class FirebaseAuthService {
  private readonly auth: Auth = getAuth();

  async createAuthUser(user: CreateAuthUserDto) {
    const userToCreate: CreateRequest = {
      disabled: false,
      displayName: user.name,
      email: user.email,
      password: user.password,
    };

    const userRecord = await this.auth.createUser(userToCreate);
    return userRecord;
  }

  public async setUserClaims(uid: string, claims: Partial<Claims>) {
    const previousClaims = (await this.auth.getUser(uid)).customClaims;
    await this.auth.setCustomUserClaims(uid, {
      ...previousClaims,
      ...claims,
    });
  }

  async updateUser(uid: string, user: Partial<UpdateRequest>) {
    const userRecord = await this.auth.updateUser(uid, user);
    return userRecord;
  }

  async getUserByEmail(email: string) {
    const userRecord = await this.auth.getUserByEmail(email);
    return userRecord;
  }

  async generateEmailByName(originalName: string): Promise<string> {
    const generatedName = originalName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

    const email = `${generatedName}@upbusiness.com`;
    try {
      await this.getUserByEmail(email);
      // means that the email already exists, so we try generate it again
      const sufix = Math.floor(Math.random() * 1000);
      return this.generateEmailByName(`${originalName}${sufix}`);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        return email;
      }
      throw error;
    }
  }
}
