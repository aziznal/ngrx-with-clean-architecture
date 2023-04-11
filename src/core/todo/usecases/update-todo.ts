import { Todo } from '../entities';
import { TodoRepository } from '../repositories';

export abstract class UpdateTodoUsecase {
  abstract execute(updatedTodo: Todo): void;
}

export class UpdateTodoUsecaseImpl implements UpdateTodoUsecase {
  constructor(private todoRepository: TodoRepository) {}

  execute(updatedTodo: Todo): void {
    this.todoRepository.update(updatedTodo);
  }
}
