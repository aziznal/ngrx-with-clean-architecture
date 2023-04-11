import { Todo } from '../entities';
import { TodoRepository } from '../repositories';

export abstract class CreateTodoUsecase {
  abstract execute(): void;
}

export class CreateTodoUsecaseImpl implements CreateTodoUsecase {
  constructor(private todoRepository: TodoRepository) {}

  execute(): void {
    const todo: Todo = {
      id: Math.floor(Math.random() * 100000),
      title: 'New todo',
      description: 'New todo description',
      completed: false,
    };

    this.todoRepository.create(todo);
  }
}
