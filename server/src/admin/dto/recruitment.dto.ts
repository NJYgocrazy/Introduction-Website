import { IsBoolean, IsInt, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateRecruitmentPostDto {
  @IsString()
  titleZh!: string;

  @IsString()
  titleEn!: string;

  @IsString()
  contentZh!: string;

  @IsString()
  contentEn!: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  applyUrl?: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @IsOptional()
  @IsInt()
  ord?: number;
}

export class UpdateRecruitmentPostDto {
  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  contentZh?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  applyUrl?: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @IsOptional()
  @IsInt()
  ord?: number;
}
