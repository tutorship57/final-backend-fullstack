import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @MinLength(15, { message: 'Password must be at least 15 characters' })
  @MaxLength(64, { message: 'Password must not exceed 64 characters' })
  // ตรวจสอบ Symbols หรือ Spaces
  @Matches(/[^A-Za-z0-9]|\s/, {
    message: 'Password must include symbols or spaces',
  })
  // ตรวจสอบ Big letter และ Number (หรืออนุญาตถ้ามี space ตามเงื่อนไขคุณ)
  @Matches(/(?=.*[A-Z])(?=.*[0-9])|\s/, {
    message:
      'Password must contain at least one uppercase letter and one number, or a space',
  })
  password: string;
}

export class RegisterResponseDto {
  id: string;
  email: string;
}
