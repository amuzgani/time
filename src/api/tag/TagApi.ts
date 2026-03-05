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

export default class TagApi extends ITagApi {
  async getTags(): Promise<GetTagsResult> {
    try {
      const response = await this.get<unknown[]>('/tags');

      return {
        success: true,
        message: null,
        data: response.data.map((item) => TagEntity.fromJson(item)),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: [],
      };
    }
  }

  async getTagById(params: GetTagByIdParams): Promise<GetTagByIdResult> {
    try {
      const response = await this.get<unknown>(`/tags/${params.id}`);

      return {
        success: true,
        message: null,
        data: TagEntity.fromJson(response.data),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: null,
      };
    }
  }

  async createTag(params: CreateTagParams): Promise<CreateTagResult> {
    try {
      const response = await this.post<unknown>('/tags', {
        name: params.name,
        color: params.color,
      });

      return {
        success: true,
        message: null,
        data: TagEntity.fromJson(response.data),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: null,
      };
    }
  }

  async updateTag(params: UpdateTagParams): Promise<UpdateTagResult> {
    try {
      const response = await this.put<unknown>(`/tags/${params.id}`, {
        name: params.name,
        color: params.color,
      });

      return {
        success: true,
        message: null,
        data: TagEntity.fromJson(response.data),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: null,
      };
    }
  }

  async deleteTag(params: DeleteTagParams): Promise<DeleteTagResult> {
    try {
      await this.delete(`/tags/${params.id}`);

      return {
        success: true,
        message: null,
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
      };
    }
  }
}

