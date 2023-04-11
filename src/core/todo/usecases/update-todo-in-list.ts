import { Todo } from '../entities';
import { TodoListRepository } from '../repositories';

export abstract class UpdateTodoInListUsecase {
  abstract execute(updatedTodo: Todo): void;
}

export class UpdateTodoInListUsecaseImpl implements UpdateTodoInListUsecase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(updatedTodo: Todo): void {
    this.todoListRepository.update(updatedTodo);
  }
}
