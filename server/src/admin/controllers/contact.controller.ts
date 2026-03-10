import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { AdminGuard } from "../../common/auth/admin.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateContactInfoDto } from "../dto/contact.dto";

@UseGuards(AdminGuard)
@Controller("admin/contact")
export class ContactController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  get() {
    return this.prisma.contactInfo.findUnique({ where: { id: 1 } });
  }

  @Put()
  async update(@Body() dto: UpdateContactInfoDto) {
    return this.prisma.contactInfo.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        addressZh: dto.addressZh,
        addressEn: dto.addressEn,
        email: dto.email,
        phone: dto.phone,
        links: dto.links as Prisma.InputJsonValue | undefined
      },
      update: {
        addressZh: dto.addressZh,
        addressEn: dto.addressEn,
        email: dto.email,
        phone: dto.phone,
        links: dto.links as Prisma.InputJsonValue | undefined
      }
    });
  }
}
