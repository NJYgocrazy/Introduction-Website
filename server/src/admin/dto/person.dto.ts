import {
  IsArray,
  IsEmail,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUrl
} from "class-validator";

export class CreatePersonDto {
  @IsString()
  role!: string;

  @IsString()
  nameZh!: string;

  @IsString()
  nameEn!: string;

  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  bioZh?: string;

  @IsOptional()
  @IsString()
  bioEn?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  avatarUrl?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  websiteUrl?: string;

  @IsOptional()
  @IsObject()
  links?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  ord?: number;

  @IsOptional()
  @IsArray()
  publicationIds?: number[];
}

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  nameZh?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  bioZh?: string;

  @IsOptional()
  @IsString()
  bioEn?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  avatarUrl?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  websiteUrl?: string;

  @IsOptional()
  @IsObject()
  links?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  ord?: number;

  @IsOptional()
  @IsArray()
  publicationIds?: number[];
}
