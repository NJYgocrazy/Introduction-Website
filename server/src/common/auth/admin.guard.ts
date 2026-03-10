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

    const decoded = this.verify(token, secret);
    req.admin = decoded;
    return true;
  }

  private verify(token: string, secret: string): AdminJwtPayload {
    try {
      const decoded = jwt.verify(token, secret) as unknown;
      if (!decoded || typeof decoded !== "object") {
        throw new UnauthorizedException("Invalid token");
      }

      const subRaw = (decoded as any).sub;
      const usernameRaw = (decoded as any).username;
      const sub = typeof subRaw === "number" ? subRaw : Number(subRaw);
      const username = typeof usernameRaw === "string" ? usernameRaw : "";

      if (!Number.isFinite(sub) || sub <= 0 || !username) {
        throw new UnauthorizedException("Invalid token");
      }

      return { sub, username };
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
