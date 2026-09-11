import { Response } from 'express';
import { ComplaintsService } from './complaints.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { ComplaintStatus } from '../../shared/types';
import { CreateComplaintDto, QueryComplaintsDto, AssignComplaintDto, UpdatePriorityDto, AddRemarkDto, ResolveComplaintDto, CloseComplaintDto, RejectComplaintDto, CreateCategoryDto, UpdateCategoryDto, TogglePublicComplaintDto, QueryPublicComplaintsDto } from './complaints.dto';
export declare class ComplaintsController {
    private readonly complaintsService;
    constructor(complaintsService: ComplaintsService);
    getCategories(req: TenantRequest): Promise<(import("./complaint-category.schema").ComplaintCategory & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createCategory(req: TenantRequest, dto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, import("./complaint-category.schema").ComplaintCategoryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./complaint-category.schema").ComplaintCategory & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateCategory(req: TenantRequest, catId: string, dto: UpdateCategoryDto): Promise<import("mongoose").Document<unknown, {}, import("./complaint-category.schema").ComplaintCategoryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./complaint-category.schema").ComplaintCategory & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteCategory(req: TenantRequest, catId: string): Promise<{
        message: string;
    }>;
    findMine(req: TenantRequest & {
        user: any;
    }): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getMyStats(req: TenantRequest & {
        user: any;
    }): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        resolved: number;
        closed: number;
        rejected: number;
    }>;
    findPublic(req: TenantRequest, query: QueryPublicComplaintsDto): Promise<{
        items: {
            _id: any;
            complaintNumber: any;
            title: any;
            description: any;
            category: any;
            status: any;
            priority: any;
            area: {
                name: any;
            } | null;
            attachments: any;
            resolutionDetails: any;
            resolutionProof: any;
            resolvedAt: any;
            publishedAt: any;
            publicRemarks: any;
            timeline: any;
            citizenInitial: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAnalytics(req: TenantRequest): Promise<{
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
    getStats(req: TenantRequest): Promise<any>;
    create(req: TenantRequest & {
        user: any;
    }, dto: CreateComplaintDto): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    findAll(req: TenantRequest, query: QueryComplaintsDto): Promise<{
        items: (import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    exportComplaints(req: TenantRequest & {
        user: any;
    }, query: QueryComplaintsDto & {
        format?: string;
    }, res: Response, ip: string, userAgent: string): Promise<Response<any, Record<string, any>>>;
    findOne(req: TenantRequest & {
        user: any;
    }, id: string): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    assignComplaint(req: TenantRequest & {
        user: any;
    }, id: string, dto: AssignComplaintDto): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    updatePriority(req: TenantRequest & {
        user: any;
    }, id: string, dto: UpdatePriorityDto): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    addRemark(req: TenantRequest & {
        user: any;
    }, id: string, dto: AddRemarkDto): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    resolveComplaint(req: TenantRequest & {
        user: any;
    }, id: string, dto: ResolveComplaintDto): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    closeComplaint(req: TenantRequest & {
        user: any;
    }, id: string, dto: CloseComplaintDto): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    rejectComplaint(req: TenantRequest & {
        user: any;
    }, id: string, dto: RejectComplaintDto): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    updateStatus(req: TenantRequest & {
        user: any;
    }, id: string, body: {
        status: ComplaintStatus;
        note?: string;
    }): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
    togglePublic(req: TenantRequest & {
        user: any;
    }, id: string, dto: TogglePublicComplaintDto): Promise<(import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        internalRemarks: never[];
        timeline: import("./complaint.schema").IComplaintTimelineEvent[];
        tenantId: import("mongoose").Types.ObjectId;
        complaintNumber: string;
        userId: import("mongoose").Types.ObjectId;
        areaId: import("mongoose").Types.ObjectId;
        category: string;
        title: string;
        description: string;
        attachments: string[];
        mediaUrls: string[];
        videoUrl?: string;
        status: ComplaintStatus;
        priority: import("../../shared/types").ComplaintPriority;
        assignedTo?: import("mongoose").Types.ObjectId;
        assignedBy?: import("mongoose").Types.ObjectId;
        assignedAt?: Date;
        publicRemarks: import("./complaint.schema").IComplaintRemark[];
        resolutionDetails?: string;
        resolutionProof: string[];
        resolvedAt?: Date;
        resolvedBy?: import("mongoose").Types.ObjectId;
        closedAt?: Date;
        closedBy?: import("mongoose").Types.ObjectId;
        closingNote?: string;
        rejectionReason?: string;
        rejectedAt?: Date;
        rejectedBy?: import("mongoose").Types.ObjectId;
        isPublic: boolean;
        publishedAt?: Date;
        publishedBy?: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
}
