import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password is too short. It should be at least 8 characters long.',
  })
  @MaxLength(20, {
    message: 'Password is too long. It should be at most 20 characters long.',
  })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message: 'Password must contain both uppercase and lowercase letters.',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least one special character.',
  })
  @Transform(({ value }) => value.trim())
  password: string;
}
