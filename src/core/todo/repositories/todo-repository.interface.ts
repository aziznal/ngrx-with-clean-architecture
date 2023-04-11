import { Observable } from 'rxjs';

import { Todo } from '../entities';

export interface TodoListState {
  data?: Todo[] | null;
  loading: boolean;
  error?: string | null;
}

export interface TodoState {
  data?: Todo | null;
  loading: boolean;
  error?: string | null;
}

export abstract class TodoRepository {
  abstract todoListState$: Observable<TodoListState>;

  abstract todoState$: Observable<TodoState>;

  abstract loadAllTodos(): Promise<void>;

  abstract loadTodoById(id: number): Promise<void>;

  abstract create(todo: Todo): Promise<void>;

  abstract update(todo: Todo): Promise<void>;

  abstract reorder(from: number, to: number): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
