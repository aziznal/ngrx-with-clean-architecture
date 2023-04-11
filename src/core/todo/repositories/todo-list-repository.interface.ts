import { Observable } from 'rxjs';
import { Todo } from '../entities';

export interface TodoListState {
  data?: Todo[] | null;
  loading: boolean;
  error?: string | null;
}

export abstract class TodoListRepository {
  abstract todoListState$: Observable<TodoListState>;

  abstract loadAllTodos(): Observable<TodoListState>;

  abstract create(todo: Todo): void;

  abstract update(todo: Todo): void;

  abstract reorder(from: number, to: number): void;

  abstract delete(id: number): void;
}
