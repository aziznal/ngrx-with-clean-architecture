import { Todo } from '../entities';
import { TodoListRepository } from '../repositories';

export abstract class CreateTodoInListUsecase {
  abstract execute(): void;
}

export class CreateTodoInListUsecaseImpl implements CreateTodoInListUsecase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(): void {
    const todo: Todo = {
      id: Math.floor(Math.random() * 100000),
      title: 'New todo',
      description: 'New todo description',
      completed: false,
    };

    this.todoListRepository.create(todo);
  }
}
