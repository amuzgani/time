import tagsJson from '@/assets/dummies/tag/tags_list.json';
import TagEntity from '@/entities/TagEntity';
import type {
  CreateTagParams,
  CreateTagResult,
  DeleteTagParams,
  DeleteTagResult,
  GetTagByIdParams,
  GetTagByIdResult,
  GetTagsResult,
  UpdateTagParams,
  UpdateTagResult,
} from './ITag';
import ITagApi from './ITagApi';

export default class FakeTagApi extends ITagApi {
  private tags: TagEntity[];

  private nextId: number;

  constructor() {
    super();

    this.tags = (tagsJson as unknown[]).map((item) => TagEntity.fromJson(item));
    this.nextId =
      this.tags.length > 0
        ? Math.max(...this.tags.map((tag) => tag.id)) + 1
        : 1;
  }

  async getTags(): Promise<GetTagsResult> {
    return {
      success: true,
      message: null,
      data: this.tags,
    };
  }

  async getTagById(params: GetTagByIdParams): Promise<GetTagByIdResult> {
    const target = this.tags.find((tag) => tag.id === params.id) ?? null;

    if (!target) {
      return {
        success: false,
        message: '태그를 찾을 수 없습니다.',
        data: null,
      };
    }

    return {
      success: true,
      message: null,
      data: target,
    };
  }

  async createTag(params: CreateTagParams): Promise<CreateTagResult> {
    const now = new Date().toISOString();
    const created = new TagEntity({
      id: this.nextId,
      name: params.name,
      color: params.color,
      createdAt: now,
      updatedAt: now,
    });

    this.tags = [...this.tags, created];
    this.nextId += 1;

    return {
      success: true,
      message: null,
      data: created,
    };
  }

  async updateTag(params: UpdateTagParams): Promise<UpdateTagResult> {
    const index = this.tags.findIndex((tag) => tag.id === params.id);

    if (index === -1) {
      return {
        success: false,
        message: '태그를 찾을 수 없습니다.',
        data: null,
      };
    }

    const previous = this.tags[index];
    const updated = new TagEntity({
      id: previous.id,
      name: params.name,
      color: params.color,
      createdAt: previous.createdAt,
      updatedAt: new Date().toISOString(),
    });

    this.tags = [
      ...this.tags.slice(0, index),
      updated,
      ...this.tags.slice(index + 1),
    ];

    return {
      success: true,
      message: null,
      data: updated,
    };
  }

  async deleteTag(params: DeleteTagParams): Promise<DeleteTagResult> {
    const exists = this.tags.some((tag) => tag.id === params.id);

    if (!exists) {
      return {
        success: false,
        message: '태그를 찾을 수 없습니다.',
      };
    }

    this.tags = this.tags.filter((tag) => tag.id !== params.id);

    return {
      success: true,
      message: null,
    };
  }
}

