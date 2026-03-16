import { IsOptional, IsString, IsUrl } from "class-validator";

export class CreateCarouselImageDto {
  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl!: string;
}

export class UpdateCarouselImageDto {
  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl?: string;
}