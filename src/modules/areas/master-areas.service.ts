import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MasterArea, MasterAreaDocument, AreaLevelType } from './master-area.schema';
import { AreaLevel, AreaLevelDocument, Area, AreaDocument } from './area.schema';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import { UTTAR_PRADESH_SEED } from './seed-master-areas';

@Injectable()
export class MasterAreasService {
  constructor(
    @InjectModel(MasterArea.name) private masterAreaModel: Model<MasterAreaDocument>,
    @InjectModel(AreaLevel.name) private areaLevelModel: Model<AreaLevelDocument>,
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {}

  // ─── Querying Master Hierarchy ───────────────────────────────────────────

  async getStates() {
    return this.masterAreaModel
      .find({ levelType: 'state', isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
  }

  async getLokSabhas(stateId?: string) {
    const filter: Record<string, any> = { levelType: 'lok_sabha', isActive: true };
    if (stateId) filter.stateId = new Types.ObjectId(stateId);
    return this.masterAreaModel
      .find(filter)
      .populate('stateId', 'name code')
      .sort({ name: 1 })
      .lean();
  }

  async getDistricts(stateId?: string) {
    const filter: Record<string, any> = { levelType: 'district', isActive: true };
    if (stateId) filter.stateId = new Types.ObjectId(stateId);
    return this.masterAreaModel
      .find(filter)
      .populate('stateId', 'name code')
      .sort({ name: 1 })
      .lean();
  }

  async getVidhanSabhas(filters: { stateId?: string; lokSabhaId?: string; districtId?: string }) {
    const query: Record<string, any> = { levelType: 'vidhan_sabha', isActive: true };
    if (filters.stateId) query.stateId = new Types.ObjectId(filters.stateId);
    if (filters.lokSabhaId) query.lokSabhaId = new Types.ObjectId(filters.lokSabhaId);
    if (filters.districtId) query.districtId = new Types.ObjectId(filters.districtId);

    return this.masterAreaModel
      .find(query)
      .populate('stateId', 'name code')
      .populate('lokSabhaId', 'name code')
      .populate('districtId', 'name')
      .sort({ name: 1 })
      .lean();
  }

  async getBlocks(filters: {
    stateId?: string;
    lokSabhaId?: string;
    districtId?: string;
    vidhanSabhaId?: string;
  }) {
    const query: Record<string, any> = { levelType: 'block', isActive: true };
    if (filters.stateId) query.stateId = new Types.ObjectId(filters.stateId);
    if (filters.lokSabhaId) query.lokSabhaId = new Types.ObjectId(filters.lokSabhaId);
    if (filters.districtId) query.districtId = new Types.ObjectId(filters.districtId);
    if (filters.vidhanSabhaId) query.vidhanSabhaId = new Types.ObjectId(filters.vidhanSabhaId);

    return this.masterAreaModel
      .find(query)
      .populate('stateId', 'name code')
      .populate('lokSabhaId', 'name code')
      .populate('districtId', 'name')
      .populate('vidhanSabhaId', 'name code')
      .sort({ name: 1 })
      .lean();
  }

  async getPanchayats(filters: {
    stateId?: string;
    vidhanSabhaId?: string;
    blockId?: string;
  }) {
    const query: Record<string, any> = { levelType: 'panchayat', isActive: true };
    if (filters.stateId) query.stateId = new Types.ObjectId(filters.stateId);
    if (filters.vidhanSabhaId) query.vidhanSabhaId = new Types.ObjectId(filters.vidhanSabhaId);
    if (filters.blockId) {
      const bId = new Types.ObjectId(filters.blockId);
      query.$or = [{ blockId: bId }, { parentId: bId }];
    }

    return this.masterAreaModel
      .find(query)
      .populate('stateId', 'name code')
      .populate('vidhanSabhaId', 'name code')
      .populate('blockId', 'name code')
      .sort({ name: 1 })
      .lean();
  }

  async getGrams(filters: { panchayatId?: string; blockId?: string }) {
    const query: Record<string, any> = { levelType: 'gram', isActive: true };
    if (filters.panchayatId) {
      const pId = new Types.ObjectId(filters.panchayatId);
      query.$or = [{ panchayatId: pId }, { parentId: pId }];
    }
    if (filters.blockId) {
      const bId = new Types.ObjectId(filters.blockId);
      query.$or = [{ blockId: bId }, { parentId: bId }];
    }

    return this.masterAreaModel
      .find(query)
      .populate('panchayatId', 'name code')
      .populate('blockId', 'name code')
      .sort({ name: 1 })
      .lean();
  }

  async getWards(filters: { gramId?: string; panchayatId?: string; blockId?: string }) {
    const query: Record<string, any> = { levelType: 'ward', isActive: true };
    if (filters.gramId) {
      const gId = new Types.ObjectId(filters.gramId);
      query.$or = [{ gramId: gId }, { parentId: gId }];
    } else if (filters.panchayatId) {
      const pId = new Types.ObjectId(filters.panchayatId);
      query.$or = [{ panchayatId: pId }, { parentId: pId }];
    } else if (filters.blockId) {
      const bId = new Types.ObjectId(filters.blockId);
      query.$or = [{ blockId: bId }, { parentId: bId }];
    }

    return this.masterAreaModel
      .find(query)
      .populate('gramId', 'name code')
      .populate('panchayatId', 'name code')
      .sort({ name: 1 })
      .lean();
  }

  async getSummaryCounts() {
    const [states, lokSabhas, districts, vidhanSabhas, blocks, panchayats, grams, wards] = await Promise.all([
      this.masterAreaModel.countDocuments({ levelType: 'state', isActive: true }),
      this.masterAreaModel.countDocuments({ levelType: 'lok_sabha', isActive: true }),
      this.masterAreaModel.countDocuments({ levelType: 'district', isActive: true }),
      this.masterAreaModel.countDocuments({ levelType: 'vidhan_sabha', isActive: true }),
      this.masterAreaModel.countDocuments({ levelType: 'block', isActive: true }),
      this.masterAreaModel.countDocuments({ levelType: 'panchayat', isActive: true }),
      this.masterAreaModel.countDocuments({ levelType: 'gram', isActive: true }),
      this.masterAreaModel.countDocuments({ levelType: 'ward', isActive: true }),
    ]);

    return {
      states,
      lokSabhas,
      districts,
      vidhanSabhas,
      blocks,
      panchayats,
      grams,
      wards,
      total: states + lokSabhas + districts + vidhanSabhas + blocks + panchayats + grams + wards,
    };
  }

  async getHierarchyTree(stateId?: string) {
    const stateQuery: Record<string, any> = { levelType: 'state', isActive: true };
    if (stateId) stateQuery._id = new Types.ObjectId(stateId);
    const states = await this.masterAreaModel.find(stateQuery).lean();

    const results = await Promise.all(
      states.map(async (st) => {
        const [lokSabhas, districts] = await Promise.all([
          this.masterAreaModel.find({ levelType: 'lok_sabha', stateId: st._id, isActive: true }).lean(),
          this.masterAreaModel.find({ levelType: 'district', stateId: st._id, isActive: true }).lean(),
        ]);

        const lokSabhaTrees = await Promise.all(
          lokSabhas.map(async (ls) => {
            const vidhanSabhas = await this.masterAreaModel
              .find({ levelType: 'vidhan_sabha', lokSabhaId: ls._id, isActive: true })
              .populate('districtId', 'name')
              .lean();

            const vsTrees = await Promise.all(
              vidhanSabhas.map(async (vs) => {
                const blocks = await this.masterAreaModel
                  .find({ levelType: 'block', vidhanSabhaId: vs._id, isActive: true })
                  .lean();

                const blockTrees = await Promise.all(
                  blocks.map(async (blk) => {
                    const panchayats = await this.masterAreaModel
                      .find({ levelType: 'panchayat', blockId: blk._id, isActive: true })
                      .lean();

                    const panchayatTrees = await Promise.all(
                      panchayats.map(async (gp) => {
                        const grams = await this.masterAreaModel
                          .find({ levelType: 'gram', panchayatId: gp._id, isActive: true })
                          .lean();

                        const gramTrees = await Promise.all(
                          grams.map(async (g) => {
                            const wards = await this.masterAreaModel
                              .find({ levelType: 'ward', gramId: g._id, isActive: true })
                              .lean();
                            return { ...g, wards };
                          }),
                        );

                        return { ...gp, grams: gramTrees };
                      }),
                    );

                    return { ...blk, panchayats: panchayatTrees };
                  }),
                );

                return { ...vs, blocks: blockTrees };
              }),
            );

            return { ...ls, vidhanSabhas: vsTrees };
          }),
        );

        return {
          ...st,
          districts,
          lokSabhas: lokSabhaTrees,
        };
      }),
    );

    return results;
  }

  // ─── CRUD Operations (Super Admin) ───────────────────────────────────────

  async createMasterArea(data: {
    name: string;
    code?: string;
    levelType: AreaLevelType;
    stateId?: string;
    lokSabhaId?: string;
    districtId?: string;
    vidhanSabhaId?: string;
    blockId?: string;
    panchayatId?: string;
    gramId?: string;
    parentId?: string;
    sortOrder?: number;
  }) {
    const payload: Record<string, any> = {
      name: data.name.trim(),
      code: data.code?.trim() || null,
      levelType: data.levelType,
      sortOrder: data.sortOrder || 0,
    };

    if (data.stateId) payload.stateId = new Types.ObjectId(data.stateId);
    if (data.lokSabhaId) payload.lokSabhaId = new Types.ObjectId(data.lokSabhaId);
    if (data.districtId) payload.districtId = new Types.ObjectId(data.districtId);
    if (data.vidhanSabhaId) payload.vidhanSabhaId = new Types.ObjectId(data.vidhanSabhaId);
    if (data.blockId) payload.blockId = new Types.ObjectId(data.blockId);
    if (data.panchayatId) payload.panchayatId = new Types.ObjectId(data.panchayatId);
    if (data.gramId) payload.gramId = new Types.ObjectId(data.gramId);
    if (data.parentId) payload.parentId = new Types.ObjectId(data.parentId);

    return this.masterAreaModel.create(payload);
  }

  async updateMasterArea(
    id: string,
    data: Partial<{
      name: string;
      code: string;
      sortOrder: number;
      stateId: string;
      lokSabhaId: string;
      districtId: string;
      vidhanSabhaId: string;
      blockId: string;
      panchayatId: string;
      gramId: string;
      parentId: string;
      isActive: boolean;
    }>,
  ) {
    const updates: Record<string, any> = {};
    if (data.name !== undefined) updates.name = data.name.trim();
    if (data.code !== undefined) updates.code = data.code?.trim() || null;
    if (data.sortOrder !== undefined) updates.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) updates.isActive = data.isActive;
    if (data.stateId !== undefined) updates.stateId = data.stateId ? new Types.ObjectId(data.stateId) : null;
    if (data.lokSabhaId !== undefined) updates.lokSabhaId = data.lokSabhaId ? new Types.ObjectId(data.lokSabhaId) : null;
    if (data.districtId !== undefined) updates.districtId = data.districtId ? new Types.ObjectId(data.districtId) : null;
    if (data.vidhanSabhaId !== undefined) updates.vidhanSabhaId = data.vidhanSabhaId ? new Types.ObjectId(data.vidhanSabhaId) : null;
    if (data.blockId !== undefined) updates.blockId = data.blockId ? new Types.ObjectId(data.blockId) : null;
    if (data.panchayatId !== undefined) updates.panchayatId = data.panchayatId ? new Types.ObjectId(data.panchayatId) : null;
    if (data.gramId !== undefined) updates.gramId = data.gramId ? new Types.ObjectId(data.gramId) : null;
    if (data.parentId !== undefined) updates.parentId = data.parentId ? new Types.ObjectId(data.parentId) : null;

    const updated = await this.masterAreaModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!updated) throw new NotFoundException('Master area not found');
    return updated;
  }

  async deleteMasterArea(id: string) {
    const objectId = new Types.ObjectId(id);
    const [childrenLs, childrenDist, childrenVs, childrenBlk] = await Promise.all([
      this.masterAreaModel.countDocuments({ stateId: objectId }),
      this.masterAreaModel.countDocuments({ districtId: objectId }),
      this.masterAreaModel.countDocuments({ vidhanSabhaId: objectId }),
      this.masterAreaModel.countDocuments({ lokSabhaId: objectId }),
    ]);

    const totalChildren = childrenLs + childrenDist + childrenVs + childrenBlk;
    if (totalChildren > 0) {
      throw new BadRequestException(
        `Cannot delete this area — ${totalChildren} child area(s) are linked to it. Please reassign or delete sub-areas first.`,
      );
    }

    return this.masterAreaModel.findByIdAndDelete(id);
  }

  // ─── 1-Click Seeding (Uttar Pradesh Starter Pack) ─────────────────────────

  async seedUttarPradesh() {
    const seed = UTTAR_PRADESH_SEED;

    // 1. Create / find State
    let stateDoc = await this.masterAreaModel.findOne({ levelType: 'state', name: seed.name });
    if (!stateDoc) {
      stateDoc = await this.masterAreaModel.create({
        name: seed.name,
        code: seed.code,
        levelType: 'state',
      });
    }

    // 2. Create Districts
    const districtMap = new Map<string, Types.ObjectId>();
    for (const distName of seed.districts) {
      let distDoc = await this.masterAreaModel.findOne({
        levelType: 'district',
        name: distName,
        stateId: stateDoc._id,
      });
      if (!distDoc) {
        distDoc = await this.masterAreaModel.create({
          name: distName,
          levelType: 'district',
          stateId: stateDoc._id,
        });
      }
      districtMap.set(distName.toLowerCase(), distDoc._id as Types.ObjectId);
    }

    // 3. Create Lok Sabhas, Vidhan Sabhas, and Blocks
    let totalVsCount = 0;
    let totalBlkCount = 0;

    for (const lsItem of seed.lokSabhas) {
      let lsDoc = await this.masterAreaModel.findOne({
        levelType: 'lok_sabha',
        name: lsItem.name,
        stateId: stateDoc._id,
      });
      if (!lsDoc) {
        lsDoc = await this.masterAreaModel.create({
          name: lsItem.name,
          code: lsItem.code,
          levelType: 'lok_sabha',
          stateId: stateDoc._id,
        });
      }

      for (const vsItem of lsItem.vidhanSabhas) {
        const distId = districtMap.get(vsItem.districtName.toLowerCase());
        let vsDoc = await this.masterAreaModel.findOne({
          levelType: 'vidhan_sabha',
          name: vsItem.name,
          lokSabhaId: lsDoc._id,
        });

        if (!vsDoc) {
          vsDoc = await this.masterAreaModel.create({
            name: vsItem.name,
            code: vsItem.code,
            levelType: 'vidhan_sabha',
            stateId: stateDoc._id,
            lokSabhaId: lsDoc._id,
            districtId: distId ?? undefined,
          });
          totalVsCount++;
        }

        for (const blkItem of vsItem.blocks) {
          let blkDoc = await this.masterAreaModel.findOne({
            levelType: 'block',
            name: blkItem.name,
            vidhanSabhaId: vsDoc._id,
          });

          if (!blkDoc) {
            blkDoc = await this.masterAreaModel.create({
              name: blkItem.name,
              code: blkItem.code,
              levelType: 'block',
              stateId: stateDoc._id,
              lokSabhaId: lsDoc._id,
              districtId: distId ?? undefined,
              vidhanSabhaId: vsDoc._id,
              parentId: vsDoc._id,
            });
            totalBlkCount++;
          }

          // Seed nested Panchayats & Wards if defined
          if (blkItem.panchayats && blkItem.panchayats.length > 0) {
            for (const gpItem of blkItem.panchayats) {
              let gpDoc = await this.masterAreaModel.findOne({
                levelType: 'panchayat',
                name: gpItem.name,
                blockId: blkDoc._id,
              });

              if (!gpDoc) {
                gpDoc = await this.masterAreaModel.create({
                  name: gpItem.name,
                  code: gpItem.code,
                  levelType: 'panchayat',
                  stateId: stateDoc._id,
                  lokSabhaId: lsDoc._id,
                  districtId: distId ?? undefined,
                  vidhanSabhaId: vsDoc._id,
                  blockId: blkDoc._id,
                  parentId: blkDoc._id,
                });
              }

              if (gpItem.wards && gpItem.wards.length > 0) {
                for (const wItem of gpItem.wards) {
                  let wDoc = await this.masterAreaModel.findOne({
                    levelType: 'ward',
                    name: wItem.name,
                    panchayatId: gpDoc._id,
                  });

                  if (!wDoc) {
                    await this.masterAreaModel.create({
                      name: wItem.name,
                      code: wItem.code,
                      levelType: 'ward',
                      stateId: stateDoc._id,
                      lokSabhaId: lsDoc._id,
                      districtId: distId ?? undefined,
                      vidhanSabhaId: vsDoc._id,
                      blockId: blkDoc._id,
                      panchayatId: gpDoc._id,
                      parentId: gpDoc._id,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    const counts = await this.getSummaryCounts();
    return {
      success: true,
      message: 'Uttar Pradesh electoral and administrative master data seeded successfully.',
      counts,
    };
  }

  // ─── 1-Click Tenant Provisioning from Master Data ─────────────────────────

  async provisionTenantFromMaster(
    tenantId: string,
    options: {
      stateId: string;
      scopeType: 'lok_sabha' | 'vidhan_sabha' | 'district' | 'state';
      scopeId: string;
    },
  ) {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const stateObjId = new Types.ObjectId(options.stateId);
    const scopeObjId = new Types.ObjectId(options.scopeId);

    // 1. Determine Levels to create for this tenant
    // Standard Indian hierarchy: District -> Vidhan Sabha -> Block -> Gram Panchayat / Ward
    const levelNames = ['District', 'Vidhan Sabha', 'Block', 'Gram Panchayat / Ward'];
    const createdLevels: AreaLevelDocument[] = [];

    for (let i = 0; i < levelNames.length; i++) {
      let lvl = await this.areaLevelModel.findOne({
        tenantId: tenant._id,
        name: levelNames[i],
      });
      if (!lvl) {
        lvl = await this.areaLevelModel.create({
          tenantId: tenant._id,
          levelOrder: i + 1,
          name: levelNames[i],
          isRequired: true,
        });
      }
      createdLevels.push(lvl);
    }

    const districtLvl = createdLevels[0];
    const vsLvl = createdLevels[1];
    const blockLvl = createdLevels[2];

    // 2. Fetch master areas matching the tenant's scope
    let targetVidhanSabhas: MasterAreaDocument[] = [];

    if (options.scopeType === 'lok_sabha') {
      targetVidhanSabhas = await this.masterAreaModel
        .find({ levelType: 'vidhan_sabha', lokSabhaId: scopeObjId, isActive: true })
        .populate('districtId')
        .exec();
    } else if (options.scopeType === 'vidhan_sabha') {
      targetVidhanSabhas = await this.masterAreaModel
        .find({ _id: scopeObjId, levelType: 'vidhan_sabha', isActive: true })
        .populate('districtId')
        .exec();
    } else if (options.scopeType === 'district') {
      targetVidhanSabhas = await this.masterAreaModel
        .find({ levelType: 'vidhan_sabha', districtId: scopeObjId, isActive: true })
        .populate('districtId')
        .exec();
    } else {
      targetVidhanSabhas = await this.masterAreaModel
        .find({ levelType: 'vidhan_sabha', stateId: stateObjId, isActive: true })
        .populate('districtId')
        .exec();
    }

    const createdDistrictsMap = new Map<string, Types.ObjectId>();
    let createdCount = 0;

    for (const vs of targetVidhanSabhas) {
      const distName = (vs.districtId as any)?.name || 'Central District';

      // 2a. Ensure District exists in tenant's Area collection
      let tenantDistId = createdDistrictsMap.get(distName.toLowerCase());
      if (!tenantDistId) {
        let existingDist = await this.areaModel.findOne({
          tenantId: tenant._id,
          levelId: districtLvl._id,
          name: distName,
        });
        if (!existingDist) {
          existingDist = await this.areaModel.create({
            tenantId: tenant._id,
            levelId: districtLvl._id,
            name: distName,
            isActive: true,
          });
          createdCount++;
        }
        tenantDistId = existingDist._id as Types.ObjectId;
        createdDistrictsMap.set(distName.toLowerCase(), tenantDistId);
      }

      // 2b. Create Vidhan Sabha under the District
      let tenantVs = await this.areaModel.findOne({
        tenantId: tenant._id,
        levelId: vsLvl._id,
        name: vs.name,
      });
      if (!tenantVs) {
        tenantVs = await this.areaModel.create({
          tenantId: tenant._id,
          levelId: vsLvl._id,
          parentId: tenantDistId,
          name: vs.name,
          code: vs.code || undefined,
          isActive: true,
        });
        createdCount++;
      }

      // 2c. Fetch and create Blocks under this Vidhan Sabha
      const masterBlocks = await this.masterAreaModel
        .find({ levelType: 'block', vidhanSabhaId: vs._id, isActive: true })
        .exec();

      for (const blk of masterBlocks) {
        const existingBlk = await this.areaModel.findOne({
          tenantId: tenant._id,
          levelId: blockLvl._id,
          parentId: tenantVs._id,
          name: blk.name,
        });
        if (!existingBlk) {
          await this.areaModel.create({
            tenantId: tenant._id,
            levelId: blockLvl._id,
            parentId: tenantVs._id,
            name: blk.name,
            code: blk.code || undefined,
            isActive: true,
          });
          createdCount++;
        }
      }
    }

    // 3. Update tenant settings
    await this.tenantModel.findByIdAndUpdate(tenant._id, {
      $set: {
        'settings.areaLevels': levelNames,
      },
    });

    return {
      success: true,
      message: `Successfully provisioned ${createdCount} area entities from Master Database for tenant ${tenant.name}.`,
      levelsConfigured: levelNames,
      areasCreated: createdCount,
    };
  }
}
