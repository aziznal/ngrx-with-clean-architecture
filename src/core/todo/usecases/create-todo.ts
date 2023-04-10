import { Todo } from '../entities';
import { TodoRepository } from '../repositories';

export abstract class CreateTodoUsecase {
  abstract execute(todo: Todo): void;
}

export class CreateTodoImpl implements CreateTodoUsecase {
  constructor(private repo: TodoRepository) {}

  execute(todo: Todo): void {
    this.repo.create(todo);
  }
}
