import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs";
import { extname, join } from "path";
import { nanoid } from "nanoid";

import { AdminGuard } from "../../common/auth/admin.guard";

function safeBaseName(originalName: string): string {
  const base = originalName.replace(/^.*[\\/]/, "");
  return base.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

@Controller("admin/uploads")
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = String(process.env.UPLOAD_DIR ?? "uploads");
          const abs = join(process.cwd(), uploadDir);
          if (!existsSync(abs)) {
            mkdirSync(abs, { recursive: true });
          }
          cb(null, abs);
        },
        filename: (req, file, cb) => {
          const base = safeBaseName(file.originalname);
          const ext = extname(base);
          const nameOnly = ext ? base.slice(0, -ext.length) : base;
          const filename = `${Date.now()}-${nanoid(8)}-${nameOnly}${ext}`;
          cb(null, filename);
        }
      })
    })
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    const url = `/uploads/${file.filename}`;
    return {
      filename: file.filename,
      url
    };
  }
}
