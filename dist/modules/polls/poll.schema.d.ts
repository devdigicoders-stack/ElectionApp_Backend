import { Document, Types } from 'mongoose';
export type PollDocument = Poll & Document;
export type PollVoteDocument = PollVote & Document;
export declare class Poll {
    tenantId: Types.ObjectId;
    question: string;
    options: {
        optionId: string;
        text: string;
        votes: number;
    }[];
    targetAreaId?: Types.ObjectId;
    isActive: boolean;
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
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Poll, Document<unknown, {}, Poll, {
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
}, PollVote>;
