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
import { CreateRecruitmentPostDto, UpdateRecruitmentPostDto } from "../dto/recruitment.dto";

@UseGuards(AdminGuard)
@Controller("admin/recruitment")
export class RecruitmentController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.recruitmentPost.findMany({
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
  }

  @Post()
  create(@Body() dto: CreateRecruitmentPostDto) {
    return this.prisma.recruitmentPost.create({
      data: {
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        contentZh: dto.contentZh,
        contentEn: dto.contentEn,
        applyUrl: dto.applyUrl,
        isOpen: dto.isOpen ?? true,
        ord: dto.ord ?? 0
      }
    });
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateRecruitmentPostDto
  ) {
    return this.prisma.recruitmentPost.update({
      where: { id },
      data: {
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        contentZh: dto.contentZh,
        contentEn: dto.contentEn,
        applyUrl: dto.applyUrl,
        isOpen: dto.isOpen,
        ord: dto.ord
      }
    });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prisma.recruitmentPost.delete({ where: { id } });
  }
}
