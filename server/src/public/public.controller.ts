import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import type { PersonPublication, Publication } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Controller("public")
export class PublicController {
  constructor(private readonly prisma: PrismaService) {}

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
      where: { enabled: true },
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
  }

  @Get("research-areas")
  async getResearchAreas() {
    return this.prisma.researchArea.findMany({
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
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
      orderBy: [{ date: "desc" }, { id: "desc" }]
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
      orderBy: [{ date: "desc" }, { id: "desc" }]
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
