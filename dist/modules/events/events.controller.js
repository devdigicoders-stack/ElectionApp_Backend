"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const feature_guard_1 = require("../../common/guards/feature.guard");
const feature_decorator_1 = require("../../common/decorators/feature.decorator");
const types_1 = require("../../shared/types");
const events_dto_1 = require("./events.dto");
const jwt = __importStar(require("jsonwebtoken"));
let EventsController = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    extractOptionalUser(req) {
        const auth = req.headers['authorization'];
        if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
            const token = auth.slice(7).trim();
            try {
                const decoded = jwt.decode(token);
                if (decoded) {
                    const adminRoles = [
                        types_1.UserRole.SUPER_ADMIN,
                        types_1.UserRole.LEADER,
                        types_1.UserRole.ADMIN,
                        types_1.UserRole.CONTENT_MANAGER,
                        types_1.UserRole.VOLUNTEER_MANAGER,
                        types_1.UserRole.AREA_COORDINATOR,
                    ];
                    const isAdmin = Boolean(decoded.isSuperAdmin || adminRoles.includes(decoded.role));
                    return { user: decoded, isAdmin };
                }
            }
            catch {
            }
        }
        return { user: undefined, isAdmin: false };
    }
    findAll(req, query) {
        const { user, isAdmin } = this.extractOptionalUser(req);
        return this.eventsService.findAll(req.tenant, query, user, isAdmin);
    }
    getMyGoing(req) {
        return this.eventsService.getMyGoing(req.tenant, req.user.sub);
    }
    findOne(req, id) {
        const { user } = this.extractOptionalUser(req);
        return this.eventsService.findOne(req.tenant, id, user);
    }
    rsvp(req, id, dto) {
        return this.eventsService.rsvp(req.tenant, id, req.user.sub, dto);
    }
    removeRsvp(req, id) {
        return this.eventsService.deleteRsvp(req.tenant, id, req.user.sub);
    }
    getMyRsvp(req, id) {
        return this.eventsService.getUserRsvp(req.tenant, id, req.user.sub);
    }
    getTicket(req, id, queryUserId) {
        const isAdmin = [
            types_1.UserRole.SUPER_ADMIN,
            types_1.UserRole.LEADER,
            types_1.UserRole.ADMIN,
            types_1.UserRole.VOLUNTEER_MANAGER,
        ].includes(req.user?.role);
        const targetUserId = queryUserId && isAdmin ? queryUserId : req.user.sub;
        return this.eventsService.getEventTicket(req.tenant, id, targetUserId, isAdmin);
    }
    getShareLink(req, id) {
        return this.eventsService.getShareLink(req.tenant, id);
    }
    create(req, dto) {
        return this.eventsService.create(req.tenant, dto);
    }
    getAnalytics(req, id) {
        return this.eventsService.getAnalytics(req.tenant, id);
    }
    exportCsv(req, id, res, format, ipAddress, userAgent) {
        return this.eventsService.exportAttendeesCsv(req.tenant, id, res, format, req.user, ipAddress, userAgent);
    }
    lookupTicket(req, id, ticketNumber) {
        return this.eventsService.lookupTicket(req.tenant, id, ticketNumber);
    }
    checkIn(req, id, dto) {
        return this.eventsService.checkInAttendee(req.tenant, id, dto, req.user);
    }
    update(req, id, dto) {
        return this.eventsService.update(req.tenant, id, dto);
    }
    remove(req, id) {
        return this.eventsService.remove(req.tenant, id);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, events_dto_1.QueryEventsDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-going'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getMyGoing", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/rsvp'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, events_dto_1.RsvpEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "rsvp", null);
__decorate([
    (0, common_1.Delete)(':id/rsvp'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "removeRsvp", null);
__decorate([
    (0, common_1.Get)(':id/my-rsvp'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getMyRsvp", null);
__decorate([
    (0, common_1.Get)(':id/ticket'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getTicket", null);
__decorate([
    (0, common_1.Get)(':id/share'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getShareLink", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, events_dto_1.CreateEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER, types_1.UserRole.VOLUNTEER_MANAGER, types_1.UserRole.AREA_COORDINATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)([':id/export', ':id/attendees/export']),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER, types_1.UserRole.VOLUNTEER_MANAGER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Query)('format')),
    __param(4, (0, common_1.Ip)()),
    __param(5, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)(':id/check-in/lookup/:ticketNumber'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER, types_1.UserRole.VOLUNTEER_MANAGER, types_1.UserRole.AREA_COORDINATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('ticketNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "lookupTicket", null);
__decorate([
    (0, common_1.Post)(':id/check-in'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER, types_1.UserRole.VOLUNTEER_MANAGER, types_1.UserRole.AREA_COORDINATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, events_dto_1.CheckInEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, events_dto_1.UpdateEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "remove", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)('events'),
    (0, common_1.UseGuards)(feature_guard_1.FeatureGuard),
    (0, feature_decorator_1.RequireFeature)(types_1.FeatureKey.EVENTS),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map