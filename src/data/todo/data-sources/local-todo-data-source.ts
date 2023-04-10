import { todoCore } from '../../../core';

export abstract class LocalTodoDataSource {
  abstract getTodo(): todoCore.entities.Todo | null;

  abstract update(todo: todoCore.entities.Todo | null): void;
}

export class LocalTodoDataSourceImpl implements LocalTodoDataSource {
  todo: todoCore.entities.Todo | null = null;

  getTodo(): todoCore.entities.Todo | null {
    return this.todo;
  }

  update(todo: todoCore.entities.Todo | null): void {
    this.todo = todo;
  }
}
