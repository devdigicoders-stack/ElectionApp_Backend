import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { SuperAdminDomainsController } from './super-admin-domains.controller';
import { TenantDomainController } from './tenant-domain.controller';
import { CustomDomainsService } from './custom-domains.service';
import { Tenant, TenantSchema } from './tenant.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { AdminUser, AdminUserSchema } from '../admin-users/admin-user.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
    ]),
    AuditLogsModule,
  ],
  controllers: [
    TenantsController,
    SuperAdminDomainsController,
    TenantDomainController,
  ],
  providers: [TenantsService, CustomDomainsService],
  exports: [TenantsService, CustomDomainsService, MongooseModule],
})
export class TenantsModule {}

