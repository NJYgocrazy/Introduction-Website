import { IsInt, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateAwardDto {
  @IsString()
  titleZh!: string;

  @IsString()
  titleEn!: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  personId?: number;
}

export class UpdateAwardDto {
  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  personId?: number;
}