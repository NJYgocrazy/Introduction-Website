import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";

import { AdminGuard } from "../../common/auth/admin.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateLabProfileDto } from "../dto/lab-profile.dto";

@UseGuards(AdminGuard)
@Controller("admin/lab-profile")
export class LabProfileController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  get() {
    return this.prisma.labProfile.findUnique({ where: { id: 1 } });
  }

  @Put()
  async update(@Body() dto: UpdateLabProfileDto) {
    return this.prisma.labProfile.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        nameZh: dto.nameZh ?? "",
        nameEn: dto.nameEn ?? "",
        introZh: dto.introZh ?? "",
        introEn: dto.introEn ?? ""
      },
      update: {
        nameZh: dto.nameZh,
        nameEn: dto.nameEn,
        introZh: dto.introZh,
        introEn: dto.introEn
      }
    });
  }
}
