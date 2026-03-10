import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import express from "express";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

import { AppModule } from "./app.module";

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

  app.enableCors({
    origin: webOrigin,
    credentials: false
  });

  app.use("/uploads", express.static(absUploadDir));

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
