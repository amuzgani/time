import TodoEntity from '@/entities/TodoEntity';
import type {
  CreateTodoParams,
  CreateTodoResult,
  DeleteTodoParams,
  DeleteTodoResult,
  GetTodoByIdParams,
  GetTodoByIdResult,
  GetTodosResult,
  UpdateTodoParams,
  UpdateTodoResult,
} from './ITodo';
import ITodoApi from './ITodoApi';

export default class TodoApi extends ITodoApi {
  async getTodos(): Promise<GetTodosResult> {
    try {
      const response = await this.get<unknown[]>('/todos');

      return {
        success: true,
        message: null,
        data: response.data.map((item) => TodoEntity.fromJson(item)),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: [],
      };
    }
  }

  async getTodoById(params: GetTodoByIdParams): Promise<GetTodoByIdResult> {
    try {
      const response = await this.get<unknown>(`/todos/${params.id}`);

      return {
        success: true,
        message: null,
        data: TodoEntity.fromJson(response.data),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: null,
      };
    }
  }

  async createTodo(params: CreateTodoParams): Promise<CreateTodoResult> {
    try {
      const response = await this.post<unknown>('/todos', {
        title: params.title,
        description: params.description ?? null,
      });

      return {
        success: true,
        message: null,
        data: TodoEntity.fromJson(response.data),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: null,
      };
    }
  }

  async updateTodo(params: UpdateTodoParams): Promise<UpdateTodoResult> {
    try {
      const payload: Record<string, unknown> = {};

      if (params.title !== undefined) {
        payload.title = params.title;
      }

      if (params.description !== undefined) {
        payload.description = params.description;
      }

      if (params.isCompleted !== undefined) {
        payload.is_completed = params.isCompleted;
      }

      const response = await this.put<unknown>(`/todos/${params.id}`, payload);

      return {
        success: true,
        message: null,
        data: TodoEntity.fromJson(response.data),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: null,
      };
    }
  }

  async deleteTodo(params: DeleteTodoParams): Promise<DeleteTodoResult> {
    try {
      await this.delete(`/todos/${params.id}`);

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

