import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";

import { AdminGuard } from "../../common/auth/admin.guard";
import { LoginDto } from "../dto/auth.dto";
import { AuthService } from "../services/auth.service";

@Controller("admin/auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password);
  }

  @UseGuards(AdminGuard)
  @Get("me")
  me(@Req() req: any) {
    return { admin: req.admin };
  }

  @Post("logout")
  logout() {
    return { ok: true };
  }
}
