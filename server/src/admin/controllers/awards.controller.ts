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

@UseGuards(AdminGuard)
@Controller("admin/awards")
export class AwardsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.award.findMany({
      orderBy: [{ id: "desc" }]
    });
  }

  @Post()
  create(@Body() dto: CreateAwardDto) {
    return this.prisma.award.create({
      data: {
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        imageUrl: dto.imageUrl,
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
        imageUrl: dto.imageUrl,
        personId: dto.personId
      }
    });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prisma.award.delete({ where: { id } });
  }
}