import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Password must ne a string' })
  @MinLength(6, { message: 'Password must be 6 character long' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Password must ne a string' })
  @MinLength(6, { message: 'Password must be 6 character long' })
  password: string;
}
