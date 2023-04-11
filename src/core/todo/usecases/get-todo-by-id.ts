import { Observable } from 'rxjs';

import { TodoRepository, TodoState } from '../repositories';

export abstract class GetTodoByIdUsecase {
  abstract execute(id: number): Observable<TodoState>;
}

export class GetTodoByIdUsecaseImpl implements GetTodoByIdUsecase {
  constructor(private todoRepository: TodoRepository) {}

  execute(id: number): Observable<TodoState> {
    this.todoRepository.loadTodoById(id);

    return this.todoRepository.todoState$;
  }
}
