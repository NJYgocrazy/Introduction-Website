import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import type { PersonPublication, Publication } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Controller("public")
export class PublicController {
  constructor(private readonly prisma: PrismaService) {}

  private isMissingAreaImageUrlColumn(error: unknown): boolean {
    const message = String((error as any)?.message ?? "");
    return message.includes("ResearchArea.imageUrl") || message.includes("ResearchArea`.`imageUrl");
  }

  private async getResearchAreasSafe() {
    try {
      return await this.prisma.researchArea.findMany({
        orderBy: [{ ord: "asc" }, { id: "asc" }]
      });
    } catch (error) {
      if (!this.isMissingAreaImageUrlColumn(error)) throw error;
      const rows = await this.prisma.researchArea.findMany({
        orderBy: [{ ord: "asc" }, { id: "asc" }],
        select: {
          id: true,
          nameZh: true,
          nameEn: true,
          descZh: true,
          descEn: true,
          ord: true
        }
      });
      return rows.map((row) => ({ ...row, imageUrl: null }));
    }
  }

  @Get("lab-profile")
  async getLabProfile() {
    return this.prisma.labProfile.findUnique({ where: { id: 1 } });
  }

  @Get("contact")
  async getContact() {
    return this.prisma.contactInfo.findUnique({ where: { id: 1 } });
  }

  @Get("carousel")
  async getCarousel() {
    return this.prisma.carouselImage.findMany({
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
  }

  @Get("research-areas")
  async getResearchAreas() {
    return this.getResearchAreasSafe();
  }

  @Get("research-projects")
  async getResearchProjects() {
    return this.prisma.researchProject.findMany({
      where: { enabled: true },
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
  }

  @Get("research-showcase")
  async getResearchShowcase() {
    const [areas, projects] = await Promise.all([
      this.getResearchAreasSafe(),
      this.prisma.researchProject.findMany({
        where: { enabled: true },
        orderBy: [{ ord: "asc" }, { id: "asc" }]
      })
    ]);

    return [
      ...areas.map((row) => ({
        id: `area-${row.id}`,
        sourceType: "area" as const,
        sourceId: row.id,
        titleZh: row.nameZh,
        titleEn: row.nameEn,
        descZh: row.descZh,
        descEn: row.descEn,
        imageUrl: row.imageUrl,
        linkUrl: null,
        ord: row.ord
      })),
      ...projects.map((row) => ({
        id: `project-${row.id}`,
        sourceType: "project" as const,
        sourceId: row.id,
        titleZh: row.titleZh,
        titleEn: row.titleEn,
        descZh: row.descZh,
        descEn: row.descEn,
        imageUrl: row.imageUrl,
        linkUrl: row.linkUrl,
        ord: row.ord
      }))
    ];
  }

  @Get("publications")
  async getPublications() {
    return this.prisma.publication.findMany({
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }]
    });
  }

  @Get("people")
  async getPeople(
    @Query("role") role?: string,
    @Query("q") q?: string
  ) {
    const query = (q ?? "").trim();
    return this.prisma.person.findMany({
      where: {
        ...(role ? { role } : {}),
        ...(query
          ? {
              OR: [
                { nameZh: { contains: query } },
                { nameEn: { contains: query } },
                { titleZh: { contains: query } },
                { titleEn: { contains: query } }
              ]
            }
          : {})
      },
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
  }

  @Get("people/:id")
  async getPerson(@Param("id", ParseIntPipe) id: number) {
    const person = await this.prisma.person.findUnique({ where: { id } });
    if (!person) return null;

    const publications: Array<PersonPublication & { publication: Publication }> =
      await this.prisma.personPublication.findMany({
      where: { personId: id },
      orderBy: [{ ord: "asc" }],
      include: { publication: true }
    });

    const awards = await this.prisma.award.findMany({
      where: { personId: id },
      orderBy: [{ id: "desc" }]
    });

    return {
      ...person,
      publications: publications.map((p) => p.publication),
      awards
    };
  }

  @Get("awards")
  async getAwards() {
    return this.prisma.award.findMany({
      orderBy: [{ id: "desc" }]
    });
  }

  @Get("recruitment")
  async getRecruitment() {
    return this.prisma.recruitmentPost.findMany({
      where: { isOpen: true },
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
  }
}



