import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PosterGeneratorService } from './poster-generator.service';
import { PosterGeneratorController } from './poster-generator.controller';
import { BackgroundRemovalService } from './background-removal.service';
import { PosterTemplate, PosterTemplateSchema } from './poster-template.schema';
import { GeneratedPoster, GeneratedPosterSchema } from './generated-poster.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PosterTemplate.name, schema: PosterTemplateSchema },
      { name: GeneratedPoster.name, schema: GeneratedPosterSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PosterGeneratorController],
  providers: [PosterGeneratorService, BackgroundRemovalService],
  exports: [PosterGeneratorService, BackgroundRemovalService],
})
export class PosterGeneratorModule {}
