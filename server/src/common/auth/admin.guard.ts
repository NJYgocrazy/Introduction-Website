import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";

export type AdminJwtPayload = {
  sub: number;
  username: string;
};

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader: string | undefined = req.headers?.authorization;

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const token = authHeader.slice("bearer ".length);
    const secret = String(this.config.get("JWT_SECRET") ?? "");
    if (!secret) {
      throw new UnauthorizedException("Server JWT secret is not configured");
    }

    try {
      const payload = jwt.verify(token, secret) as AdminJwtPayload;
      req.admin = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
