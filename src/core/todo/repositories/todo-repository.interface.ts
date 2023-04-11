import { Observable } from 'rxjs';

import { Todo } from '../entities/todo';

export interface TodoState {
  data?: Todo | null;
  loading: boolean;
  error?: string | null;
}

export abstract class TodoRepository {
  abstract todoState$: Observable<TodoState>;

  abstract loadTodoById(id: number): Observable<TodoState>;

  abstract update(todo: Todo): void;

  abstract delete(id: number): void;
}
