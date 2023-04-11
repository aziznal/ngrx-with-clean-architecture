import { Observable } from 'rxjs';
import { Todo } from '../entities';

export interface TodoListState {
  data?: Todo[] | null;
  loading: boolean;
  error?: string | null;
}

export abstract class TodoListRepository {
  abstract todoListState$: Observable<TodoListState>;

  abstract loadAllTodos(): Promise<void>;

  abstract create(todo: Todo): Promise<void>;

  abstract update(todo: Todo): Promise<void>;

  abstract reorder(from: number, to: number): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
