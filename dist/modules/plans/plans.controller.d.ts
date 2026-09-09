import { PlansService } from './plans.service';
import { CreatePlanDto, UpdatePlanDto, AssignPlanDto } from './plan.dto';
export declare class PlansSuperAdminController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(dto: CreatePlanDto): Promise<import("./plan.schema").PlanDocument>;
    findAll(isActive?: string): Promise<import("./plan.schema").PlanDocument[]>;
    findOne(id: string): Promise<import("./plan.schema").PlanDocument>;
    update(id: string, dto: UpdatePlanDto): Promise<import("./plan.schema").PlanDocument>;
    remove(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    toggleActive(id: string, isActive: boolean): Promise<import("./plan.schema").PlanDocument>;
    assignPlanToTenant(tenantId: string, dto: AssignPlanDto): Promise<{
        message: string;
        tenant: (import("mongoose").Document<unknown, {}, import("../tenants/tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../tenants/tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
        featuresProvisioned: string[];
    }>;
}
export declare class PlansPublicController {
    private readonly plansService;
    constructor(plansService: PlansService);
    findActivePlans(): Promise<import("./plan.schema").PlanDocument[]>;
    findBySlug(slug: string): Promise<import("./plan.schema").PlanDocument>;
}
