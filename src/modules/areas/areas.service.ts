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

  async createLevel(tenant: TenantDocument, data: { levelOrder: number; name: string; isRequired?: boolean }) {
    return this.levelModel.create({ tenantId: tenant._id, ...data });
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

  async createArea(tenant: TenantDocument, data: { levelId: string; parentId?: string; name: string; code?: string }) {
    return this.areaModel.create({ tenantId: tenant._id, ...data });
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
