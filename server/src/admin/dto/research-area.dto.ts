import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateResearchAreaDto {
  @IsString()
  nameZh!: string;

  @IsString()
  nameEn!: string;

  @IsOptional()
  @IsString()
  descZh?: string;

  @IsOptional()
  @IsString()
  descEn?: string;

  @IsOptional()
  @IsInt()
  ord?: number;
}

export class UpdateResearchAreaDto {
  @IsOptional()
  @IsString()
  nameZh?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  descZh?: string;

  @IsOptional()
  @IsString()
  descEn?: string;

  @IsOptional()
  @IsInt()
  ord?: number;
}
