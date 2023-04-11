import { TodoRepository } from '../repositories';

export abstract class DeleteTodoUsecase {
  abstract execute(id: number): void;
}

export class DeleteTodoUsecaseImpl implements DeleteTodoUsecase {
  constructor(private todoListRepository: TodoRepository) {}

  execute(id: number): void {
    this.todoListRepository.delete(id);
  }
}
