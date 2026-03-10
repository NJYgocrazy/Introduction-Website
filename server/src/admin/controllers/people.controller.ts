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
import { CreatePersonDto, UpdatePersonDto } from "../dto/person.dto";
import { PeopleService } from "../services/people.service";

@UseGuards(AdminGuard)
@Controller("admin/people")
export class PeopleController {
  constructor(
    private readonly people: PeopleService,
    private readonly prisma: PrismaService
  ) {}

  @Get()
  async list() {
    const rows = await this.prisma.person.findMany({
      orderBy: [{ ord: "asc" }, { id: "asc" }]
    });

    const joins = await this.prisma.personPublication.findMany({
      where: { personId: { in: rows.map((r) => r.id) } },
      orderBy: [{ ord: "asc" }]
    });

    const byPerson = new Map<number, number[]>();
    for (const j of joins) {
      const arr = byPerson.get(j.personId) ?? [];
      arr.push(j.publicationId);
      byPerson.set(j.personId, arr);
    }

    return rows.map((p) => ({
      ...p,
      publicationIds: byPerson.get(p.id) ?? []
    }));
  }

  @Get(":id")
  async get(@Param("id", ParseIntPipe) id: number) {
    const person = await this.prisma.person.findUnique({ where: { id } });
    if (!person) return null;

    const joins = await this.prisma.personPublication.findMany({
      where: { personId: id },
      orderBy: [{ ord: "asc" }]
    });

    return {
      ...person,
      publicationIds: joins.map((j) => j.publicationId)
    };
  }

  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.people.create(dto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePersonDto
  ) {
    return this.people.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prisma.person.delete({ where: { id } });
  }
}
