import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { Complaint, ComplaintDocument } from './complaint.schema';
import { ComplaintCategory, ComplaintCategoryDocument } from './complaint-category.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { ComplaintStatus, ComplaintPriority } from '../../shared/types';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateComplaintDto, QueryComplaintsDto, AssignComplaintDto, UpdatePriorityDto, AddRemarkDto, ResolveComplaintDto, CloseComplaintDto, RejectComplaintDto, CreateCategoryDto, UpdateCategoryDto } from './complaints.dto';
export declare class ComplaintsService {
    private complaintModel;
    private categoryModel;
    private auditLogsService?;
    constructor(complaintModel: Model<ComplaintDocument>, categoryModel: Model<ComplaintCategoryDocument>, auditLogsService?: AuditLogsService | undefined);
    private generateNumber;
    create(tenant: TenantDocument, userId: string, dto: CreateComplaintDto): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: Types.ObjectId;
        complaintNumber: string;
        userId: Types.ObjectId;
        areaId: Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        assignedTo?: Types.ObjectId;
        assignedBy?: Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: Types.ObjectId;
        closedAt?: Date;
        closedBy?: Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    findByUser(tenant: TenantDocument, userId: string): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(tenant: TenantDocument, id: string, requester?: {
        sub: string;
        role?: string;
    }): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: Types.ObjectId;
        complaintNumber: string;
        userId: Types.ObjectId;
        areaId: Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        assignedTo?: Types.ObjectId;
        assignedBy?: Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: Types.ObjectId;
        closedAt?: Date;
        closedBy?: Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    getCitizenDashboardCounters(tenant: TenantDocument, userId: string): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        resolved: number;
        closed: number;
        rejected: number;
    }>;
    findAll(tenant: TenantDocument, queryDto: QueryComplaintsDto): Promise<{
        items: (Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    assignComplaint(tenant: TenantDocument, id: string, dto: AssignComplaintDto, adminUser: any): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: Types.ObjectId;
        complaintNumber: string;
        userId: Types.ObjectId;
        areaId: Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        assignedTo?: Types.ObjectId;
        assignedBy?: Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: Types.ObjectId;
        closedAt?: Date;
        closedBy?: Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    updatePriority(tenant: TenantDocument, id: string, dto: UpdatePriorityDto, adminUser: any): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: Types.ObjectId;
        complaintNumber: string;
        userId: Types.ObjectId;
        areaId: Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        assignedTo?: Types.ObjectId;
        assignedBy?: Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: Types.ObjectId;
        closedAt?: Date;
        closedBy?: Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    addRemark(tenant: TenantDocument, id: string, dto: AddRemarkDto, adminUser: any): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: Types.ObjectId;
        complaintNumber: string;
        userId: Types.ObjectId;
        areaId: Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        assignedTo?: Types.ObjectId;
        assignedBy?: Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: Types.ObjectId;
        closedAt?: Date;
        closedBy?: Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    resolveComplaint(tenant: TenantDocument, id: string, dto: ResolveComplaintDto, adminUser: any): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: Types.ObjectId;
        complaintNumber: string;
        userId: Types.ObjectId;
        areaId: Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        assignedTo?: Types.ObjectId;
        assignedBy?: Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: Types.ObjectId;
        closedAt?: Date;
        closedBy?: Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    closeComplaint(tenant: TenantDocument, id: string, dto: CloseComplaintDto, adminUser: any): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: Types.ObjectId;
        complaintNumber: string;
        userId: Types.ObjectId;
        areaId: Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        assignedTo?: Types.ObjectId;
        assignedBy?: Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: Types.ObjectId;
        closedAt?: Date;
        closedBy?: Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    rejectComplaint(tenant: TenantDocument, id: string, dto: RejectComplaintDto, adminUser: any): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: Types.ObjectId;
        complaintNumber: string;
        userId: Types.ObjectId;
        areaId: Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        assignedTo?: Types.ObjectId;
        assignedBy?: Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: Types.ObjectId;
        closedAt?: Date;
        closedBy?: Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    updateStatus(tenant: TenantDocument, id: string, status: ComplaintStatus, note: string, updatedBy: string): Promise<(Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: Types.ObjectId;
        complaintNumber: string;
        userId: Types.ObjectId;
        areaId: Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        assignedTo?: Types.ObjectId;
        assignedBy?: Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: Types.ObjectId;
        closedAt?: Date;
        closedBy?: Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    getAnalytics(tenant: TenantDocument): Promise<{
        summary: {
            totalComplaints: number;
            pending: number;
            inProgress: number;
            resolved: number;
            closed: number;
            rejected: number;
            resolutionRatePercentage: number;
            averageResolutionTimeHours: number;
            averageResolutionTimeDays: number;
        };
        byStatus: Record<string, number>;
        byPriority: Record<string, number>;
        byCategory: {
            category: any;
            count: any;
        }[];
        byArea: {
            areaId: any;
            areaName: any;
            total: any;
            open: any;
        }[];
        topProblemAreas: {
            areaId: any;
            areaName: any;
            openComplaints: any;
            totalComplaints: any;
        }[];
        monthlyTrend: {
            month: string;
            submitted: any;
            resolved: any;
        }[];
    }>;
    getDashboardStats(tenant: TenantDocument): Promise<any>;
    getCategories(tenant: TenantDocument): Promise<(ComplaintCategory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createCategory(tenant: TenantDocument, dto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, ComplaintCategoryDocument, {}, import("mongoose").DefaultSchemaOptions> & ComplaintCategory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateCategory(tenant: TenantDocument, catId: string, dto: UpdateCategoryDto): Promise<import("mongoose").Document<unknown, {}, ComplaintCategoryDocument, {}, import("mongoose").DefaultSchemaOptions> & ComplaintCategory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteCategory(tenant: TenantDocument, catId: string): Promise<{
        message: string;
    }>;
    exportComplaints(tenant: TenantDocument, query: QueryComplaintsDto, res: Response, format?: string, adminUser?: any, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
}
