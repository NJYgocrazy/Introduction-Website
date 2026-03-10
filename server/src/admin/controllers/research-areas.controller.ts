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
import { CreateResearchAreaDto, UpdateResearchAreaDto } from "../dto/research-area.dto";

@UseGuards(AdminGuard)
@Controller("admin/research-areas")
export class ResearchAreasController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.researchArea.findMany({
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
  }

  @Post()
  create(@Body() dto: CreateResearchAreaDto) {
    return this.prisma.researchArea.create({
      data: {
        nameZh: dto.nameZh,
        nameEn: dto.nameEn,
        descZh: dto.descZh,
        descEn: dto.descEn,
        ord: dto.ord ?? 0
      }
    });
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateResearchAreaDto
  ) {
    return this.prisma.researchArea.update({
      where: { id },
      data: {
        nameZh: dto.nameZh,
        nameEn: dto.nameEn,
        descZh: dto.descZh,
        descEn: dto.descEn,
        ord: dto.ord
      }
    });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prisma.researchArea.delete({ where: { id } });
  }
}
