import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { HttpAdapterHost } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import * as express from "express";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = Number(config.get("PORT") ?? 3000);
  const webOrigin = String(config.get("WEB_ORIGIN") ?? "http://localhost:5173");
  const uploadDir = String(config.get("UPLOAD_DIR") ?? "uploads");

  const absUploadDir = join(process.cwd(), uploadDir);
  if (!existsSync(absUploadDir)) {
    mkdirSync(absUploadDir, { recursive: true });
  }

  const allowedOrigins = new Set(
    webOrigin
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://127.0.0.1:5173");
  allowedOrigins.add("http://localhost:4173");
  allowedOrigins.add("http://127.0.0.1:4173");

  app.enableCors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization"]
  });

  app.use("/uploads", express.static(absUploadDir));

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(adapterHost));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  await app.listen(port);
}

void bootstrap();
