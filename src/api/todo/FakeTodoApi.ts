import TodoEntity from '@/entities/TodoEntity';
import todosJson from '@/assets/dummies/todo/todos_list.json';
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

export default class FakeTodoApi extends ITodoApi {
  private todos: TodoEntity[];

  private nextId: number;

  constructor() {
    super();

    this.todos = (todosJson as unknown[]).map((item) => TodoEntity.fromJson(item));
    this.nextId =
      this.todos.length > 0
        ? Math.max(...this.todos.map((todo) => todo.id)) + 1
        : 1;
  }

  async getTodos(): Promise<GetTodosResult> {
    return {
      success: true,
      message: null,
      data: this.todos,
    };
  }

  async getTodoById(params: GetTodoByIdParams): Promise<GetTodoByIdResult> {
    const target = this.todos.find((todo) => todo.id === params.id) ?? null;

    if (!target) {
      return {
        success: false,
        message: '할 일을 찾을 수 없습니다.',
        data: null,
      };
    }

    return {
      success: true,
      message: null,
      data: target,
    };
  }

  async createTodo(params: CreateTodoParams): Promise<CreateTodoResult> {
    const now = new Date().toISOString();
    const created = new TodoEntity({
      id: this.nextId,
      title: params.title,
      description: params.description ?? null,
      isCompleted: false,
      dueDate: null,
      createdAt: now,
      updatedAt: now,
      tags: [],
    });

    this.todos = [...this.todos, created];
    this.nextId += 1;

    return {
      success: true,
      message: null,
      data: created,
    };
  }

  async updateTodo(params: UpdateTodoParams): Promise<UpdateTodoResult> {
    const index = this.todos.findIndex((todo) => todo.id === params.id);

    if (index === -1) {
      return {
        success: false,
        message: '할 일을 찾을 수 없습니다.',
        data: null,
      };
    }

    const previous = this.todos[index];
    const updated = new TodoEntity({
      id: previous.id,
      title: params.title ?? previous.title,
      description:
        params.description !== undefined
          ? params.description
          : previous.description,
      isCompleted:
        params.isCompleted !== undefined
          ? params.isCompleted
          : previous.isCompleted,
      dueDate: previous.dueDate ?? null,
      createdAt: previous.createdAt,
      updatedAt: new Date().toISOString(),
      tags: previous.tags,
    });

    this.todos = [
      ...this.todos.slice(0, index),
      updated,
      ...this.todos.slice(index + 1),
    ];

    return {
      success: true,
      message: null,
      data: updated,
    };
  }

  async deleteTodo(params: DeleteTodoParams): Promise<DeleteTodoResult> {
    const exists = this.todos.some((todo) => todo.id === params.id);

    if (!exists) {
      return {
        success: false,
        message: '할 일을 찾을 수 없습니다.',
      };
    }

    this.todos = this.todos.filter((todo) => todo.id !== params.id);

    return {
      success: true,
      message: null,
    };
  }
}

