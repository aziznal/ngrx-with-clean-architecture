import { Observable } from 'rxjs';

import { TodoListState, TodoRepository } from '../repositories';

export abstract class GetAllTodosUsecase {
  abstract execute(): Observable<TodoListState>;
}

export class GetAllTodosImpl implements GetAllTodosUsecase {
  constructor(private repo: TodoRepository) {}

  execute(): Observable<TodoListState> {
    return this.repo.getAllTodos();
  }
}
