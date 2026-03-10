import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  async login(username: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const secret = String(this.config.get("JWT_SECRET") ?? "");
    if (!secret) {
      throw new UnauthorizedException("Server JWT secret is not configured");
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      secret,
      { expiresIn: "12h" }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username
      }
    };
  }
}
