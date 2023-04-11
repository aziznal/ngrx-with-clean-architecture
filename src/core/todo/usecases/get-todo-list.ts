import { Observable, shareReplay } from 'rxjs';

import { TodoListRepository, TodoListState } from '../repositories';

export abstract class GetAllTodosUsecase {
  abstract execute(): Observable<TodoListState>;
}

export class GetAllTodosImpl implements GetAllTodosUsecase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(): Observable<TodoListState> {
    this.todoListRepository.loadAllTodos();

    return this.todoListRepository.todoListState$;
  }
}
