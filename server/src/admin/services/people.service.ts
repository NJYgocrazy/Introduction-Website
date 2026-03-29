import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { CreatePersonDto, UpdatePersonDto } from "../dto/person.dto";

function normalizeIdList(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const ids = value
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n) && n > 0);
  return Array.from(new Set(ids));
}

@Injectable()
export class PeopleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePersonDto) {
    const publicationIds = normalizeIdList(dto.publicationIds);

    const person = await this.prisma.person.create({
      data: {
        role: dto.role,
        nameZh: dto.nameZh,
        nameEn: dto.nameEn,
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        bioZh: dto.bioZh,
        bioEn: dto.bioEn,
        teacherResumeZh: dto.teacherResumeZh,
        teacherResumeEn: dto.teacherResumeEn,
        teacherResearchZh: dto.teacherResearchZh,
        teacherResearchEn: dto.teacherResearchEn,
        teacherAchievementsZh: dto.teacherAchievementsZh,
        teacherAchievementsEn: dto.teacherAchievementsEn,
        studentResearchZh: dto.studentResearchZh,
        studentResearchEn: dto.studentResearchEn,
        studentAwardsZh: dto.studentAwardsZh,
        studentAwardsEn: dto.studentAwardsEn,
        studentEmploymentZh: dto.studentEmploymentZh,
        studentEmploymentEn: dto.studentEmploymentEn,
        avatarUrl: dto.avatarUrl,
        email: dto.email,
        websiteUrl: dto.websiteUrl,
        links: dto.links as Prisma.InputJsonValue | undefined,
        ord: dto.ord ?? 0
      }
    });

    await this.replacePublications(person.id, publicationIds);

    return this.prisma.person.findUnique({ where: { id: person.id } });
  }

  async update(id: number, dto: UpdatePersonDto) {
    const publicationIds =
      dto.publicationIds === undefined ? undefined : normalizeIdList(dto.publicationIds);

    await this.prisma.person.update({
      where: { id },
      data: {
        role: dto.role,
        nameZh: dto.nameZh,
        nameEn: dto.nameEn,
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        bioZh: dto.bioZh,
        bioEn: dto.bioEn,
        teacherResumeZh: dto.teacherResumeZh,
        teacherResumeEn: dto.teacherResumeEn,
        teacherResearchZh: dto.teacherResearchZh,
        teacherResearchEn: dto.teacherResearchEn,
        teacherAchievementsZh: dto.teacherAchievementsZh,
        teacherAchievementsEn: dto.teacherAchievementsEn,
        studentResearchZh: dto.studentResearchZh,
        studentResearchEn: dto.studentResearchEn,
        studentAwardsZh: dto.studentAwardsZh,
        studentAwardsEn: dto.studentAwardsEn,
        studentEmploymentZh: dto.studentEmploymentZh,
        studentEmploymentEn: dto.studentEmploymentEn,
        avatarUrl: dto.avatarUrl,
        email: dto.email,
        websiteUrl: dto.websiteUrl,
        links: dto.links as Prisma.InputJsonValue | undefined,
        ord: dto.ord
      }
    });

    if (publicationIds !== undefined) {
      await this.replacePublications(id, publicationIds);
    }

    return this.prisma.person.findUnique({ where: { id } });
  }

  private async replacePublications(personId: number, publicationIds: number[]) {
    await this.prisma.personPublication.deleteMany({ where: { personId } });

    if (publicationIds.length === 0) return;

    await this.prisma.personPublication.createMany({
      data: publicationIds.map((publicationId, idx) => ({
        personId,
        publicationId,
        ord: idx
      }))
    });
  }
}