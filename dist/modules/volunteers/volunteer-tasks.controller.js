"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerTasksController = void 0;
const common_1 = require("@nestjs/common");
const volunteer_tasks_service_1 = require("./volunteer-tasks.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const volunteer_task_dto_1 = require("./volunteer-task.dto");
const types_1 = require("../../shared/types");
let VolunteerTasksController = class VolunteerTasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(req, dto) {
        return this.tasksService.create(req.tenant, dto, req.user);
    }
    findAll(req, query) {
        return this.tasksService.findAll(req.tenant, query);
    }
    findMyTasks(req, status) {
        return this.tasksService.findMyTasks(req.tenant, req.user.sub, { status });
    }
    getStats(req) {
        return this.tasksService.getStats(req.tenant);
    }
    findOne(req, id) {
        return this.tasksService.findOne(req.tenant, id);
    }
    update(req, id, dto) {
        return this.tasksService.update(req.tenant, id, dto);
    }
    acceptTask(req, id) {
        return this.tasksService.acceptTask(req.tenant, id, req.user);
    }
    submitTask(req, id, dto) {
        return this.tasksService.submitTask(req.tenant, id, dto, req.user);
    }
    reviewTask(req, id, dto) {
        return this.tasksService.reviewTask(req.tenant, id, dto, req.user);
    }
    remove(req, id) {
        return this.tasksService.remove(req.tenant, id);
    }
};
exports.VolunteerTasksController = VolunteerTasksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, volunteer_task_dto_1.CreateVolunteerTaskDto]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, volunteer_task_dto_1.QueryVolunteerTaskDto]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "findMyTasks", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, volunteer_task_dto_1.UpdateVolunteerTaskDto]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "acceptTask", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, volunteer_task_dto_1.SubmitVolunteerTaskDto]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "submitTask", null);
__decorate([
    (0, common_1.Patch)(':id/review'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, volunteer_task_dto_1.ReviewVolunteerTaskDto]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "reviewTask", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], VolunteerTasksController.prototype, "remove", null);
exports.VolunteerTasksController = VolunteerTasksController = __decorate([
    (0, common_1.Controller)('volunteers/tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [volunteer_tasks_service_1.VolunteerTasksService])
], VolunteerTasksController);
//# sourceMappingURL=volunteer-tasks.controller.js.map