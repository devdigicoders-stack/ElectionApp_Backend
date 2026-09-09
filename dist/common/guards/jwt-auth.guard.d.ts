import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
export declare const IS_PUBLIC = "isPublic";
export declare class JwtAuthGuard implements CanActivate {
    private reflector;
    private configService;
    constructor(reflector: Reflector, configService: ConfigService);
    canActivate(context: ExecutionContext): boolean;
    private extractToken;
}
