import { TodoRepository } from '../repositories';

export abstract class ReorderTodoUsecase {
  abstract execute(from: number, to: number): void;
}

export class ReorderTodoUsecaseImpl implements ReorderTodoUsecase {
  constructor(private todoRepository: TodoRepository) {}

  execute(from: number, to: number): void {
    this.todoRepository.reorder(from, to);
  }
}
