import { TodoListRepository } from '../repositories';

export abstract class DeleteTodoInListUsecase {
  abstract execute(id: number): void;
}

export class DeleteTodoInListUsecaseImpl implements DeleteTodoInListUsecase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(id: number): void {
    this.todoListRepository.delete(id);
  }
}
