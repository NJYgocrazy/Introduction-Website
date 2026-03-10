import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { HttpAdapterHost } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import express from "express";
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

  app.enableCors({
    origin: webOrigin,
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
