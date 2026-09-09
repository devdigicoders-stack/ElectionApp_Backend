export declare class ConfigureDomainDto {
    domain: string;
}
export declare class VerifyDomainDto {
    forceVerify?: boolean;
    method?: 'AUTO' | 'TXT' | 'CNAME';
}
export declare class DomainQueryDto {
    search?: string;
    status?: string;
    page?: string | number;
    limit?: string | number;
}
