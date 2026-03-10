import { IsObject, IsOptional, IsString } from "class-validator";

export class UpdateContactInfoDto {
  @IsOptional()
  @IsString()
  addressZh?: string;

  @IsOptional()
  @IsString()
  addressEn?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsObject()
  links?: Record<string, unknown>;
}
