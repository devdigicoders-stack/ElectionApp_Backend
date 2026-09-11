import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MasterAreaDocument = MasterArea & Document;

export type AreaLevelType =
  | 'state'
  | 'lok_sabha'
  | 'district'
  | 'vidhan_sabha'
  | 'block'
  | 'panchayat'
  | 'gram'
  | 'ward';

@Schema({ timestamps: true })
export class MasterArea {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: null, trim: true })
  code?: string; // e.g. "UP", "PC-79", "AC-398", "GP-01", "W-05"

  @Prop({
    required: true,
    enum: ['state', 'lok_sabha', 'district', 'vidhan_sabha', 'block', 'panchayat', 'gram', 'ward'],
  })
  levelType: AreaLevelType;

  // Level 1: State has no parent
  // Level 2: Lok Sabha belongs to State
  // Level 3: District belongs to State
  // Level 4: Vidhan Sabha belongs to State, Lok Sabha, and District
  // Level 5: Block belongs to State, Lok Sabha, District, and Vidhan Sabha
  // Level 6: Panchayat belongs to Block (and inherits VS, District, LS, State)
  // Level 7: Gram (Village) belongs to Panchayat
  // Level 8: Ward / Booth belongs to Gram

  @Prop({ type: Types.ObjectId, ref: 'MasterArea', default: null })
  stateId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'MasterArea', default: null })
  lokSabhaId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'MasterArea', default: null })
  districtId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'MasterArea', default: null })
  vidhanSabhaId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'MasterArea', default: null })
  blockId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'MasterArea', default: null })
  panchayatId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'MasterArea', default: null })
  gramId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'MasterArea', default: null })
  parentId?: Types.ObjectId | null;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;
}

export const MasterAreaSchema = SchemaFactory.createForClass(MasterArea);

MasterAreaSchema.index({ levelType: 1, name: 1 });
MasterAreaSchema.index({ levelType: 1, stateId: 1 });
MasterAreaSchema.index({ levelType: 1, lokSabhaId: 1 });
MasterAreaSchema.index({ levelType: 1, districtId: 1 });
MasterAreaSchema.index({ levelType: 1, vidhanSabhaId: 1 });
MasterAreaSchema.index({ levelType: 1, blockId: 1 });
MasterAreaSchema.index({ levelType: 1, panchayatId: 1 });
MasterAreaSchema.index({ levelType: 1, gramId: 1 });
MasterAreaSchema.index({ levelType: 1, parentId: 1 });
