import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { createHash } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { extname, join } from "path";
import { nanoid } from "nanoid";

import { AdminGuard } from "../../common/auth/admin.guard";

function safeBaseName(originalName: string): string {
  const base = originalName.replace(/^.*[\\/]/, "");
  return base.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function buildFilename(originalName: string): string {
  const base = safeBaseName(originalName);
  const ext = extname(base);
  const nameOnly = ext ? base.slice(0, -ext.length) : base;
  return `${Date.now()}-${nanoid(8)}-${nameOnly}${ext}`;
}

function getCloudinaryConfig(config: ConfigService) {
  const cloudName = String(config.get("CLOUDINARY_CLOUD_NAME") ?? "").trim();
  const apiKey = String(config.get("CLOUDINARY_API_KEY") ?? "").trim();
  const apiSecret = String(config.get("CLOUDINARY_API_SECRET") ?? "").trim();
  const folder = String(config.get("CLOUDINARY_FOLDER") ?? "").trim();

  const filled = [cloudName, apiKey, apiSecret].filter(Boolean).length;
  const enabled = filled === 3;
  const partial = filled > 0 && filled < 3;

  return { cloudName, apiKey, apiSecret, folder, enabled, partial };
}

@Controller("admin/uploads")
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 15 * 1024 * 1024 }
    })
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded.");
    }

    const cloud = getCloudinaryConfig(this.config);

    if (cloud.partial) {
      throw new BadRequestException(
        "Cloudinary config is incomplete. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
      );
    }

    if (cloud.enabled) {
      return this.uploadToCloudinary(file, cloud);
    }

    return this.uploadToLocal(file);
  }

  private uploadToLocal(file: Express.Multer.File) {
    const uploadDir = String(this.config.get("UPLOAD_DIR") ?? "uploads");
    const abs = join(process.cwd(), uploadDir);
    if (!existsSync(abs)) {
      mkdirSync(abs, { recursive: true });
    }

    const filename = buildFilename(file.originalname);
    writeFileSync(join(abs, filename), file.buffer);

    return {
      filename,
      url: `/uploads/${filename}`,
      provider: "local"
    };
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
    cloud: { cloudName: string; apiKey: string; apiSecret: string; folder: string }
  ) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signParams: Record<string, string | number> = { timestamp };
    if (cloud.folder) signParams.folder = cloud.folder;

    const toSign = Object.keys(signParams)
      .sort()
      .map((k) => `${k}=${signParams[k]}`)
      .join("&");
    const signature = createHash("sha1").update(`${toSign}${cloud.apiSecret}`).digest("hex");

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype || "application/octet-stream" });
    formData.append("file", blob, file.originalname);
    formData.append("api_key", cloud.apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    if (cloud.folder) formData.append("folder", cloud.folder);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloud.cloudName}/image/upload`;
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData
    });

    const text = await res.text();
    if (!res.ok) {
      throw new BadRequestException(`Cloudinary upload failed: ${text}`);
    }

    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      throw new BadRequestException("Cloudinary returned invalid JSON.");
    }

    const url = String(json.secure_url ?? json.url ?? "").trim();
    if (!url) {
      throw new BadRequestException("Cloudinary did not return image URL.");
    }

    const filename = String(json.public_id ?? buildFilename(file.originalname));
    return { filename, url, provider: "cloudinary" };
  }
}