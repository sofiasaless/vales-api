export interface AuthUserLoginDto {
  email: string;
  password: string;
}

export interface CreateAuthUserDto extends AuthUserLoginDto {
  name: string;
}