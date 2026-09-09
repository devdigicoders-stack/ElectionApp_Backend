export declare class SendOtpDto {
    mobile: string;
}
export declare class VerifyOtpDto {
    mobile: string;
    code?: string;
    otp?: string;
}
export declare class CompleteProfileDto {
    name: string;
    customFields?: Record<string, any>;
}
export declare class AdminLoginDto {
    email: string;
    password: string;
}
