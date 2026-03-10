import { IsOptional, IsString } from "class-validator";

export class UpdateLabProfileDto {
  @IsOptional()
  @IsString()
  nameZh?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  introZh?: string;

  @IsOptional()
  @IsString()
  introEn?: string;
}
