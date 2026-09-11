import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AreaLevel, AreaLevelDocument, Area, AreaDocument } from './area.schema';
import { TenantDocument } from '../tenants/tenant.schema';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(AreaLevel.name) private levelModel: Model<AreaLevelDocument>,
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
  ) {}

  // --- Levels ---

  async createLevel(
    tenant: TenantDocument,
    data: { levelOrder?: number; rank?: number; name: string; isRequired?: boolean },
  ) {
    const levelOrder = Number(data.levelOrder ?? data.rank ?? 1);
    return this.levelModel.create({
      tenantId: tenant._id,
      name: data.name.trim(),
      levelOrder,
      isRequired: data.isRequired !== false,
    });
  }

  async getLevels(tenant: TenantDocument) {
    return this.levelModel.find({ tenantId: tenant._id }).sort({ levelOrder: 1 });
  }

  async updateLevel(tenant: TenantDocument, levelId: string, data: Partial<{ name: string; levelOrder: number }>) {
    return this.levelModel.findOneAndUpdate(
      { _id: levelId, tenantId: tenant._id },
      { $set: data },
      { new: true },
    );
  }

  async deleteLevel(tenant: TenantDocument, levelId: string) {
    // Safety: don't delete if areas are using this level
    const usageCount = await this.areaModel.countDocuments({
      tenantId: tenant._id,
      levelId: new Types.ObjectId(levelId),
    });
    if (usageCount > 0) {
      throw new BadRequestException(
        `Cannot delete level — ${usageCount} area(s) are using it. Delete those areas first.`,
      );
    }
    return this.levelModel.findOneAndDelete({ _id: levelId, tenantId: tenant._id });
  }

  // --- Areas ---

  async createArea(
    tenant: TenantDocument,
    data: { levelId: string; parentId?: string; name: string; code?: string },
  ) {
    const payload: any = {
      tenantId: tenant._id,
      name: data.name.trim(),
      levelId: Types.ObjectId.isValid(data.levelId) ? new Types.ObjectId(data.levelId) : data.levelId,
    };
    if (data.parentId && typeof data.parentId === 'string' && data.parentId.trim().length > 0) {
      payload.parentId = Types.ObjectId.isValid(data.parentId) ? new Types.ObjectId(data.parentId) : data.parentId;
    } else {
      payload.parentId = null;
    }
    if (data.code && data.code.trim()) {
      payload.code = data.code.trim();
    }
    return this.areaModel.create(payload);
  }

  async updateArea(
    tenant: TenantDocument,
    id: string,
    data: Partial<{ name: string; code?: string; levelId: string; parentId?: string; isActive?: boolean }>,
  ) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    const cleanData: any = {};

    if (data.name !== undefined) cleanData.name = data.name.trim();
    if (data.code !== undefined) cleanData.code = data.code ? data.code.trim() : null;
    if (data.isActive !== undefined) cleanData.isActive = Boolean(data.isActive);

    if (data.levelId) {
      cleanData.levelId = Types.ObjectId.isValid(data.levelId) ? new Types.ObjectId(data.levelId) : data.levelId;
    }

    if (data.parentId !== undefined) {
      if (data.parentId && typeof data.parentId === 'string' && data.parentId.trim().length > 0) {
        cleanData.parentId = Types.ObjectId.isValid(data.parentId) ? new Types.ObjectId(data.parentId) : data.parentId;
      } else {
        cleanData.parentId = null;
      }
    }

    const area = await this.areaModel.findOneAndUpdate(
      {
        _id: objectId,
        $or: [{ tenantId: tenant._id }, { tenantId: tenant._id?.toString() }],
      },
      { $set: cleanData },
      { new: true },
    );

    if (!area) throw new NotFoundException('Area not found');
    return area;
  }

  async deleteArea(tenant: TenantDocument, id: string) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;

    // Safety: don't delete if sub-areas exist
    const childCount = await this.areaModel.countDocuments({
      tenantId: tenant._id,
      parentId: objectId,
      isActive: true,
    });
    if (childCount > 0) {
      throw new BadRequestException(
        `Cannot delete this area because it has ${childCount} sub-area(s). Delete or move sub-areas first.`,
      );
    }

    const area = await this.areaModel.findOneAndDelete({
      _id: objectId,
      $or: [{ tenantId: tenant._id }, { tenantId: tenant._id?.toString() }],
    });

    if (!area) throw new NotFoundException('Area not found');
    return { success: true, message: 'Area deleted successfully' };
  }

  async getAreasByLevel(tenant: TenantDocument, levelId: string) {
    return this.areaModel.find({ tenantId: tenant._id, levelId, isActive: true }).sort({ name: 1 });
  }

  async getChildren(tenant: TenantDocument, parentId: string) {
    return this.areaModel
      .find({ tenantId: tenant._id, parentId: new Types.ObjectId(parentId), isActive: true })
      .populate('levelId', 'name levelOrder')
      .sort({ name: 1 });
  }

  async getTree(tenant: TenantDocument) {
    const levels = await this.levelModel.find({ tenantId: tenant._id }).sort({ levelOrder: 1 });
    const areas = await this.areaModel
      .find({ tenantId: tenant._id, isActive: true })
      .populate('levelId', 'name levelOrder')
      .lean();

    // Build tree from flat list
    const map = new Map<string, any>();
    areas.forEach((a) => map.set(a._id.toString(), { ...a, children: [] }));

    const roots: any[] = [];
    areas.forEach((a) => {
      if (a.parentId) {
        const parent = map.get(a.parentId.toString());
        if (parent) parent.children.push(map.get(a._id.toString()));
      } else {
        roots.push(map.get(a._id.toString()));
      }
    });

    return { levels, tree: roots };
  }

  async findById(tenant: TenantDocument, areaId: string) {
    const area = await this.areaModel.findOne({ _id: areaId, tenantId: tenant._id }).populate('levelId');
    if (!area) throw new NotFoundException('Area not found');
    return area;
  }

  async getAncestors(tenant: TenantDocument, areaId: string): Promise<any[]> {
    const ancestors: any[] = [];
    let currentId: string | null = areaId;

    while (currentId) {
      const area: (AreaDocument & Record<string, any>) | null = await this.areaModel
        .findOne({ _id: currentId, tenantId: tenant._id })
        .populate('levelId', 'name levelOrder')
        .lean();

      if (!area) break;
      ancestors.unshift(area);
      currentId = area.parentId ? area.parentId.toString() : null;
    }

    return ancestors;
  }
}
