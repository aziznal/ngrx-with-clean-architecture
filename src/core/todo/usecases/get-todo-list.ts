import { Observable } from 'rxjs';

import { TodoListState, TodoRepository } from '../repositories/todo-repository.interface';

export abstract class GetTodoListUsecase {
  abstract execute(): Observable<TodoListState>;
}

export class GetTodoListImpl implements GetTodoListUsecase {
  constructor(private todoRepository: TodoRepository) {}

  execute(): Observable<TodoListState> {
    this.todoRepository.loadAllTodos();

    return this.todoRepository.todoListState$;
  }
}
