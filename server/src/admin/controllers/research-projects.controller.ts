import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";

import { AdminGuard } from "../../common/auth/admin.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateResearchProjectDto, UpdateResearchProjectDto } from "../dto/research-project.dto";

@UseGuards(AdminGuard)
@Controller("admin/research-projects")
export class ResearchProjectsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.researchProject.findMany({
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
  }

  @Post()
  create(@Body() dto: CreateResearchProjectDto) {
    return this.prisma.researchProject.create({
      data: {
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        descZh: dto.descZh,
        descEn: dto.descEn,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        ord: dto.ord ?? 0,
        enabled: dto.enabled ?? true
      }
    });
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateResearchProjectDto
  ) {
    return this.prisma.researchProject.update({
      where: { id },
      data: {
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        descZh: dto.descZh,
        descEn: dto.descEn,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        ord: dto.ord,
        enabled: dto.enabled
      }
    });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prisma.researchProject.delete({ where: { id } });
  }
}

