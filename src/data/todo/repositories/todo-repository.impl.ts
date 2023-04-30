import { BehaviorSubject, Observable, of } from 'rxjs';

import { todoCore } from '@core';

export class TodoRepositoryImpl implements todoCore.repositories.TodoRepository {
  todoListState$ = of();

  todoState$ = of();

  loadAllTodos(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  loadTodoById(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  create(todo: todoCore.entities.Todo): Promise<void> {
    throw new Error('Method not implemented.');
  }

  update(todo: todoCore.entities.Todo): Promise<void> {
    throw new Error('Method not implemented.');
  }

  reorder(from: number, to: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
