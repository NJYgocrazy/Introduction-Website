import { IsBoolean, IsInt, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateCarouselImageDto {
  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl!: string;

  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  captionZh?: string;

  @IsOptional()
  @IsString()
  captionEn?: string;

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

export class UpdateCarouselImageDto {
  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  captionZh?: string;

  @IsOptional()
  @IsString()
  captionEn?: string;

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
