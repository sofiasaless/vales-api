import { InternUserEntity } from "../../../entities/internUser.entity";

export type InternUserResponseDto = Omit<InternUserEntity, "senha">;
