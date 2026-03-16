import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreateResearchProjectDto {
  @IsString()
  titleZh!: string;

  @IsString()
  titleEn!: string;

  @IsOptional()
  @IsString()
  descZh?: string;

  @IsOptional()
  @IsString()
  descEn?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsInt()
  ord?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateResearchProjectDto {
  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  descZh?: string;

  @IsOptional()
  @IsString()
  descEn?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsInt()
  ord?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

