import { Document, Types } from 'mongoose';
import { PollTargetAudience, PollResultVisibility } from '../../shared/types';
export type PollDocument = Poll & Document;
export type PollVoteDocument = PollVote & Document;
export declare class Poll {
    tenantId: Types.ObjectId;
    question: string;
    description?: string;
    category?: string;
    options: {
        optionId: string;
        text: string;
        votes: number;
    }[];
    targetAreaId?: Types.ObjectId;
    targetAudience: PollTargetAudience;
    targetGender?: string;
    targetMinAge?: number;
    targetMaxAge?: number;
    resultVisibility: PollResultVisibility;
    allowRevote: boolean;
    isActive: boolean;
    startsAt?: Date;
    endsAt?: Date;
    totalVotes: number;
}
export declare const PollSchema: import("mongoose").Schema<Poll, import("mongoose").Model<Poll, any, any, any, any, any, Poll>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Poll, Document<unknown, {}, Poll, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    question?: import("mongoose").SchemaDefinitionProperty<string, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string | undefined, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    options?: import("mongoose").SchemaDefinitionProperty<{
        optionId: string;
        text: string;
        votes: number;
    }[], Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    targetAreaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    targetAudience?: import("mongoose").SchemaDefinitionProperty<PollTargetAudience, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    targetGender?: import("mongoose").SchemaDefinitionProperty<string | undefined, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    targetMinAge?: import("mongoose").SchemaDefinitionProperty<number | undefined, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    targetMaxAge?: import("mongoose").SchemaDefinitionProperty<number | undefined, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resultVisibility?: import("mongoose").SchemaDefinitionProperty<PollResultVisibility, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    allowRevote?: import("mongoose").SchemaDefinitionProperty<boolean, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    startsAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    endsAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalVotes?: import("mongoose").SchemaDefinitionProperty<number, Poll, Document<unknown, {}, Poll, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Poll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Poll>;
export declare class PollVote {
    tenantId: Types.ObjectId;
    pollId: Types.ObjectId;
    userId: Types.ObjectId;
    optionId: string;
    areaId?: Types.ObjectId;
    gender?: string;
    age?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const PollVoteSchema: import("mongoose").Schema<PollVote, import("mongoose").Model<PollVote, any, any, any, any, any, PollVote>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PollVote, Document<unknown, {}, PollVote, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PollVote, Document<unknown, {}, PollVote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    pollId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PollVote, Document<unknown, {}, PollVote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PollVote, Document<unknown, {}, PollVote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    optionId?: import("mongoose").SchemaDefinitionProperty<string, PollVote, Document<unknown, {}, PollVote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    areaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, PollVote, Document<unknown, {}, PollVote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gender?: import("mongoose").SchemaDefinitionProperty<string | undefined, PollVote, Document<unknown, {}, PollVote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    age?: import("mongoose").SchemaDefinitionProperty<number | undefined, PollVote, Document<unknown, {}, PollVote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PollVote, Document<unknown, {}, PollVote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PollVote, Document<unknown, {}, PollVote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PollVote & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, PollVote>;
