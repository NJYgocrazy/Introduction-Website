import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";

import { AdminGuard } from "../../common/auth/admin.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateResearchAreaDto, UpdateResearchAreaDto } from "../dto/research-area.dto";

@UseGuards(AdminGuard)
@Controller("admin/research-areas")
export class ResearchAreasController {
  constructor(private readonly prisma: PrismaService) {}

  private isMissingAreaImageUrlColumn(error: unknown): boolean {
    const message = String((error as any)?.message ?? "");
    return message.includes("ResearchArea.imageUrl") || message.includes("ResearchArea`.`imageUrl");
  }

  @Get()
  async list() {
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
          ord: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return rows.map((row) => ({ ...row, imageUrl: null }));
    }
  }

  @Post()
  async create(@Body() dto: CreateResearchAreaDto) {
    try {
      return await this.prisma.researchArea.create({
        data: {
          nameZh: dto.nameZh,
          nameEn: dto.nameEn,
          descZh: dto.descZh,
          descEn: dto.descEn,
          imageUrl: dto.imageUrl,
          ord: dto.ord ?? 0
        }
      });
    } catch (error) {
      if (!this.isMissingAreaImageUrlColumn(error)) throw error;
      try {
        const created = await this.prisma.researchArea.create({
          data: {
            nameZh: dto.nameZh,
            nameEn: dto.nameEn,
            descZh: dto.descZh,
            descEn: dto.descEn,
            ord: dto.ord ?? 0
          },
          select: {
            id: true,
            nameZh: true,
            nameEn: true,
            descZh: true,
            descEn: true,
            ord: true,
            createdAt: true,
            updatedAt: true
          }
        });
        return { ...created, imageUrl: null };
      } catch (retryError) {
        throw new InternalServerErrorException((retryError as any)?.message ?? "Create research area failed");
      }
    }
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateResearchAreaDto
  ) {
    try {
      return await this.prisma.researchArea.update({
        where: { id },
        data: {
          nameZh: dto.nameZh,
          nameEn: dto.nameEn,
          descZh: dto.descZh,
          descEn: dto.descEn,
          imageUrl: dto.imageUrl,
          ord: dto.ord
        }
      });
    } catch (error) {
      if (!this.isMissingAreaImageUrlColumn(error)) throw error;
      const updated = await this.prisma.researchArea.update({
        where: { id },
        data: {
          nameZh: dto.nameZh,
          nameEn: dto.nameEn,
          descZh: dto.descZh,
          descEn: dto.descEn,
          ord: dto.ord
        },
        select: {
          id: true,
          nameZh: true,
          nameEn: true,
          descZh: true,
          descEn: true,
          ord: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return { ...updated, imageUrl: null };
    }
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prisma.researchArea.delete({ where: { id } });
  }
}
