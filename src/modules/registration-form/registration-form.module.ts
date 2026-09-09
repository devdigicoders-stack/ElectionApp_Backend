import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationFormController } from './registration-form.controller';
import { RegistrationFormService } from './registration-form.service';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';
import { User, UserSchema } from '../users/user.schema';
import { AreaLevel, AreaLevelSchema } from '../areas/area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: User.name, schema: UserSchema },
      { name: AreaLevel.name, schema: AreaLevelSchema },
    ]),
  ],
  controllers: [RegistrationFormController],
  providers: [RegistrationFormService],
  exports: [RegistrationFormService],
})
export class RegistrationFormModule {}
