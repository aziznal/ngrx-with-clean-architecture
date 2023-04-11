import { TodoListRepository } from '../repositories';

export abstract class ReorderTodoInListUsecase {
  abstract execute(from: number, to: number): void;
}

export class ReorderTodoInListUsecaseImpl implements ReorderTodoInListUsecase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(from: number, to: number): void {
    this.todoListRepository.reorder(from, to);
  }
}
