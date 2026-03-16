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
import { CreateCarouselImageDto, UpdateCarouselImageDto } from "../dto/carousel.dto";

@UseGuards(AdminGuard)
@Controller("admin/carousel")
export class CarouselController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.carouselImage.findMany({
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });
  }

  @Post()
  create(@Body() dto: CreateCarouselImageDto) {
    return this.prisma.carouselImage.create({
      data: {
        imageUrl: dto.imageUrl
      }
    });
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCarouselImageDto
  ) {
    return this.prisma.carouselImage.update({
      where: { id },
      data: {
        imageUrl: dto.imageUrl
      }
    });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prisma.carouselImage.delete({ where: { id } });
  }
}