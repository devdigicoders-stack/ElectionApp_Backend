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
exports.DomainQueryDto = exports.VerifyDomainDto = exports.ConfigureDomainDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ConfigureDomainDto {
}
exports.ConfigureDomainDto = ConfigureDomainDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string'
        ? value.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim().toLowerCase()
        : value),
    (0, class_validator_1.Matches)(/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, {
        message: 'Domain must be a valid domain or subdomain name without http/https (e.g. wncoders.com or www.wncoders.com)',
    }),
    __metadata("design:type", String)
], ConfigureDomainDto.prototype, "domain", void 0);
class VerifyDomainDto {
}
exports.VerifyDomainDto = VerifyDomainDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VerifyDomainDto.prototype, "forceVerify", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['AUTO', 'TXT', 'CNAME']),
    __metadata("design:type", String)
], VerifyDomainDto.prototype, "method", void 0);
class DomainQueryDto {
}
exports.DomainQueryDto = DomainQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DomainQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['all', 'unconfigured', 'pending', 'verified', 'failed']),
    __metadata("design:type", String)
], DomainQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DomainQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DomainQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=custom-domain.dto.js.map