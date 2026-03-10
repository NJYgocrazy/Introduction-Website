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
import { CreateAwardDto, UpdateAwardDto } from "../dto/award.dto";

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

@UseGuards(AdminGuard)
@Controller("admin/awards")
export class AwardsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.award.findMany({
      orderBy: [{ date: "desc" }, { id: "desc" }]
    });
  }

  @Post()
  create(@Body() dto: CreateAwardDto) {
    return this.prisma.award.create({
      data: {
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        descZh: dto.descZh,
        descEn: dto.descEn,
        imageUrl: dto.imageUrl,
        date: parseDate(dto.date),
        personId: dto.personId
      }
    });
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAwardDto
  ) {
    return this.prisma.award.update({
      where: { id },
      data: {
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        descZh: dto.descZh,
        descEn: dto.descEn,
        imageUrl: dto.imageUrl,
        date: dto.date ? parseDate(dto.date) : undefined,
        personId: dto.personId
      }
    });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prisma.award.delete({ where: { id } });
  }
}
