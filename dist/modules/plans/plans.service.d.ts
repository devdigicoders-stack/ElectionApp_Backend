import { Model, Types } from 'mongoose';
import { PlanDocument } from './plan.schema';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import { TenantFeatureDocument } from '../features/tenant-feature.schema';
import { CreatePlanDto, UpdatePlanDto, AssignPlanDto } from './plan.dto';
export declare class PlansService {
    private planModel;
    private tenantModel;
    private featureModel;
    constructor(planModel: Model<PlanDocument>, tenantModel: Model<TenantDocument>, featureModel: Model<TenantFeatureDocument>);
    create(dto: CreatePlanDto): Promise<PlanDocument>;
    findAll(filter?: {
        isActive?: boolean;
    }): Promise<PlanDocument[]>;
    findOne(id: string): Promise<PlanDocument>;
    findBySlug(slug: string): Promise<PlanDocument>;
    update(id: string, dto: UpdatePlanDto): Promise<PlanDocument>;
    remove(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    toggleActive(id: string, isActive: boolean): Promise<PlanDocument>;
    assignPlanToTenant(tenantId: string, dto: AssignPlanDto): Promise<{
        message: string;
        tenant: (import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
        featuresProvisioned: string[];
    }>;
}
