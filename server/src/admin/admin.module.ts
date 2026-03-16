import { Module } from "@nestjs/common";

import { AdminGuard } from "../common/auth/admin.guard";
import { AuthController } from "./controllers/auth.controller";
import { UploadsController } from "./controllers/uploads.controller";
import { CarouselController } from "./controllers/carousel.controller";
import { ResearchAreasController } from "./controllers/research-areas.controller";
import { ResearchProjectsController } from "./controllers/research-projects.controller";
import { PublicationsController } from "./controllers/publications.controller";
import { PeopleController } from "./controllers/people.controller";
import { AwardsController } from "./controllers/awards.controller";
import { RecruitmentController } from "./controllers/recruitment.controller";
import { LabProfileController } from "./controllers/lab-profile.controller";
import { ContactController } from "./controllers/contact.controller";

import { AuthService } from "./services/auth.service";
import { PeopleService } from "./services/people.service";

@Module({
  controllers: [
    AuthController,
    UploadsController,
    CarouselController,
    ResearchAreasController,
    ResearchProjectsController,
    PublicationsController,
    PeopleController,
    AwardsController,
    RecruitmentController,
    LabProfileController,
    ContactController
  ],
  providers: [AdminGuard, AuthService, PeopleService]
})
export class AdminModule {}
