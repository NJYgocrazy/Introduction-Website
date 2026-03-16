import { IsOptional, IsString, IsUrl } from "class-validator";

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

  @IsString()
  @IsUrl({ require_tld: false })
  externalUrl!: string;
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
  @IsUrl({ require_tld: false })
  externalUrl?: string;
}