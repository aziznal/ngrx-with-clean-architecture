import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { TodoRepositoryImpl } from '../../../data/todo/repositories/todo-repository.impl';

import { Todo } from '../entities/todo';

export interface TodoState {
  data?: Todo | null;
  loading: boolean;
  error?: string | null;
}

export interface TodoListState {
  data?: Todo[] | null;
  loading: boolean;
  error?: string | null;
}

@Injectable({
  providedIn: 'root',
  useClass: TodoRepositoryImpl,
})
export abstract class TodoRepository {
  abstract getAllTodos(): Observable<TodoListState>;

  abstract getTodoById(id: number): Observable<TodoState>;

  abstract create(todo: Todo): void;

  abstract update(todo: Todo): void;

  abstract reorder(from: number, to: number): void;

  abstract delete(id: number): void;
}
