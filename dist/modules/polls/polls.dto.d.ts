import { PollTargetAudience, PollResultVisibility } from '../../shared/types';
export declare class CreatePollDto {
    question: string;
    options: string[];
    description?: string;
    category?: string;
    startsAt?: string;
    endsAt?: string;
    durationHours?: number;
    durationDays?: number;
    resultDeclaredAt?: string;
    targetAudience?: PollTargetAudience;
    targetAreaId?: string;
    targetGender?: string;
    targetMinAge?: number;
    targetMaxAge?: number;
    resultVisibility?: PollResultVisibility;
    allowRevote?: boolean;
    allowMultipleChoices?: boolean;
    maxChoices?: number;
    isActive?: boolean;
}
export declare class UpdatePollDto {
    question?: string;
    options?: string[];
    description?: string;
    category?: string;
    startsAt?: string;
    endsAt?: string;
    durationHours?: number;
    durationDays?: number;
    resultDeclaredAt?: string;
    targetAudience?: PollTargetAudience;
    targetAreaId?: string;
    targetGender?: string;
    targetMinAge?: number;
    targetMaxAge?: number;
    resultVisibility?: PollResultVisibility;
    allowRevote?: boolean;
    allowMultipleChoices?: boolean;
    maxChoices?: number;
    isActive?: boolean;
}
export declare class VotePollDto {
    optionId?: string;
    optionIds?: string[];
}
export declare class QueryPollsDto {
    areaId?: string;
    category?: string;
    status?: 'active' | 'upcoming' | 'ended' | 'closed' | 'all';
    page?: number;
    limit?: number;
}
