import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AdminModule } from "./admin/admin.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PublicModule } from "./public/public.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    PublicModule,
    AdminModule
  ]
})
export class AppModule {}
