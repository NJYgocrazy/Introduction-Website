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
  teacherResumeZh?: string;

  @IsOptional()
  @IsString()
  teacherResumeEn?: string;

  @IsOptional()
  @IsString()
  teacherResearchZh?: string;

  @IsOptional()
  @IsString()
  teacherResearchEn?: string;

  @IsOptional()
  @IsString()
  teacherAchievementsZh?: string;

  @IsOptional()
  @IsString()
  teacherAchievementsEn?: string;

  @IsOptional()
  @IsString()
  studentResearchZh?: string;

  @IsOptional()
  @IsString()
  studentResearchEn?: string;

  @IsOptional()
  @IsString()
  studentAwardsZh?: string;

  @IsOptional()
  @IsString()
  studentAwardsEn?: string;

  @IsOptional()
  @IsString()
  studentEmploymentZh?: string;

  @IsOptional()
  @IsString()
  studentEmploymentEn?: string;

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
  teacherResumeZh?: string;

  @IsOptional()
  @IsString()
  teacherResumeEn?: string;

  @IsOptional()
  @IsString()
  teacherResearchZh?: string;

  @IsOptional()
  @IsString()
  teacherResearchEn?: string;

  @IsOptional()
  @IsString()
  teacherAchievementsZh?: string;

  @IsOptional()
  @IsString()
  teacherAchievementsEn?: string;

  @IsOptional()
  @IsString()
  studentResearchZh?: string;

  @IsOptional()
  @IsString()
  studentResearchEn?: string;

  @IsOptional()
  @IsString()
  studentAwardsZh?: string;

  @IsOptional()
  @IsString()
  studentAwardsEn?: string;

  @IsOptional()
  @IsString()
  studentEmploymentZh?: string;

  @IsOptional()
  @IsString()
  studentEmploymentEn?: string;

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