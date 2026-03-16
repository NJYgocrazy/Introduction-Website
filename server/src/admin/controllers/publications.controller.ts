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
import { CreatePublicationDto, UpdatePublicationDto } from "../dto/publication.dto";

@UseGuards(AdminGuard)
@Controller("admin/publications")
export class PublicationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.publication.findMany({
      orderBy: [{ id: "desc" }]
    });
  }

  @Post()
  create(@Body() dto: CreatePublicationDto) {
    return this.prisma.publication.create({
      data: {
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        abstractZh: dto.abstractZh,
        abstractEn: dto.abstractEn,
        externalUrl: dto.externalUrl
      }
    });
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePublicationDto
  ) {
    return this.prisma.publication.update({
      where: { id },
      data: {
        titleZh: dto.titleZh,
        titleEn: dto.titleEn,
        abstractZh: dto.abstractZh,
        abstractEn: dto.abstractEn,
        externalUrl: dto.externalUrl
      }
    });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prisma.publication.delete({ where: { id } });
  }
}