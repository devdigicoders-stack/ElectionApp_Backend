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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignVolunteerDto = exports.AssignMembershipDto = exports.UpgradeCategoryDto = exports.BulkUntagDto = exports.BulkTagDto = exports.RemoveTagDto = exports.AddTagsDto = exports.UpdateCitizenStatusDto = exports.UpdateCitizenDto = exports.CitizenQueryDto = exports.PREDEFINED_CRM_TAGS = exports.CitizenStatus = exports.PublicUserCategory = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const types_1 = require("../../shared/types");
var PublicUserCategory;
(function (PublicUserCategory) {
    PublicUserCategory["CITIZEN"] = "citizen";
    PublicUserCategory["SUPPORTER"] = "supporter";
    PublicUserCategory["MEMBER"] = "member";
    PublicUserCategory["VOLUNTEER"] = "volunteer";
})(PublicUserCategory || (exports.PublicUserCategory = PublicUserCategory = {}));
var CitizenStatus;
(function (CitizenStatus) {
    CitizenStatus["ACTIVE"] = "active";
    CitizenStatus["INACTIVE"] = "inactive";
    CitizenStatus["BLOCKED"] = "blocked";
})(CitizenStatus || (exports.CitizenStatus = CitizenStatus = {}));
exports.PREDEFINED_CRM_TAGS = [
    'Supporter',
    'Volunteer',
    'Youth',
    'Student',
    'Farmer',
    'Business',
    'Influencer',
    'Media',
    'Active Member',
];
class CitizenQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
        this.sortBy = 'createdAt';
        this.sortOrder = 'desc';
    }
}
exports.CitizenQueryDto = CitizenQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "areaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CitizenQueryDto.prototype, "minAge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(150),
    __metadata("design:type", Number)
], CitizenQueryDto.prototype, "maxAge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "ageGroup", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "tag", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PublicUserCategory),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CitizenStatus),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "membershipStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "volunteerStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CitizenQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CitizenQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CitizenQueryDto.prototype, "format", void 0);
class UpdateCitizenDto {
}
exports.UpdateCitizenDto = UpdateCitizenDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCitizenDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCitizenDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCitizenDto.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCitizenDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCitizenDto.prototype, "areaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCitizenDto.prototype, "profilePhoto", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCitizenDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCitizenDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateCitizenDto.prototype, "customFields", void 0);
class UpdateCitizenStatusDto {
}
exports.UpdateCitizenStatusDto = UpdateCitizenStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(CitizenStatus),
    __metadata("design:type", String)
], UpdateCitizenStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCitizenStatusDto.prototype, "reason", void 0);
class AddTagsDto {
}
exports.AddTagsDto = AddTagsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AddTagsDto.prototype, "tags", void 0);
class RemoveTagDto {
}
exports.RemoveTagDto = RemoveTagDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveTagDto.prototype, "tag", void 0);
class BulkTagDto {
}
exports.BulkTagDto = BulkTagDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkTagDto.prototype, "userIds", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkTagDto.prototype, "tags", void 0);
class BulkUntagDto {
}
exports.BulkUntagDto = BulkUntagDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkUntagDto.prototype, "userIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkUntagDto.prototype, "tag", void 0);
class UpgradeCategoryDto {
}
exports.UpgradeCategoryDto = UpgradeCategoryDto;
__decorate([
    (0, class_validator_1.IsEnum)(PublicUserCategory),
    __metadata("design:type", String)
], UpgradeCategoryDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpgradeCategoryDto.prototype, "notes", void 0);
class AssignMembershipDto {
    constructor() {
        this.status = types_1.MembershipStatus.APPROVED;
        this.designation = 'Active Member';
    }
}
exports.AssignMembershipDto = AssignMembershipDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(types_1.MembershipStatus),
    __metadata("design:type", String)
], AssignMembershipDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignMembershipDto.prototype, "designation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignMembershipDto.prototype, "membershipNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AssignMembershipDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignMembershipDto.prototype, "photoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AssignMembershipDto.prototype, "paymentInfo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignMembershipDto.prototype, "notes", void 0);
class AssignVolunteerDto {
    constructor() {
        this.status = types_1.VolunteerStatus.ACTIVE;
    }
}
exports.AssignVolunteerDto = AssignVolunteerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignVolunteerDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignVolunteerDto.prototype, "assignedAreaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(types_1.VolunteerStatus),
    __metadata("design:type", String)
], AssignVolunteerDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AssignVolunteerDto.prototype, "tasks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignVolunteerDto.prototype, "notes", void 0);
//# sourceMappingURL=citizens.dto.js.map