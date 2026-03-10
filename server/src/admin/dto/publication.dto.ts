import { IsArray, IsISO8601, IsOptional, IsString, IsUrl } from "class-validator";

export class CreatePublicationDto {
  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  abstractZh?: string;

  @IsOptional()
  @IsString()
  abstractEn?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsString()
  @IsUrl({ require_tld: false })
  externalUrl!: string;

  @IsOptional()
  @IsISO8601()
  publishedAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdatePublicationDto {
  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  abstractZh?: string;

  @IsOptional()
  @IsString()
  abstractEn?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  externalUrl?: string;

  @IsOptional()
  @IsISO8601()
  publishedAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
