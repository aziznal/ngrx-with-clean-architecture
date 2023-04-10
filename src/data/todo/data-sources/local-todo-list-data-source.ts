import { todoCore } from '@core';

export abstract class LocalTodoListDataSource {
  abstract getAllTodos(): todoCore.entities.Todo[] | null;
  abstract setAllTodos(todos: todoCore.entities.Todo[] | null): void;

  abstract create(todo: todoCore.entities.Todo): void;

  abstract delete(id: number): void;

  abstract reorder(from: number, to: number): void;
}

export class LocalTodoListDataSourceImpl implements LocalTodoListDataSource {
  todos: todoCore.entities.Todo[] | null = null;

  getAllTodos(): todoCore.entities.Todo[] | null {
    return this.todos;
  }

  setAllTodos(todos: todoCore.entities.Todo[] | null): void {
    this.todos = todos;
  }

  create(todo: todoCore.entities.Todo): void {
    if (this.todos === null) {
      this.todos = [];
    }

    // if already exists, throw error
    if (this.todos.find(t => t.id === todo.id) !== undefined) {
      throw new Error(`Todo with id ${todo.id} already exists`);
    }

    this.todos.push(todo);
  }

  delete(id: number): void {
    if (this.todos === null) {
      return;
    }

    const index = this.todos.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }

    this.todos.splice(index, 1);
  }

  reorder(from: number, to: number): void {
    if (this.todos === null) {
      return;
    }

    if (from < 0 || from >= this.todos.length) {
      throw new Error(`Invalid from index ${from}`);
    }

    if (to < 0 || to >= this.todos.length) {
      throw new Error(`Invalid to index ${to}`);
    }

    const todo = this.todos[from];

    this.todos.splice(from, 1);
    this.todos.splice(to, 0, todo);
  }
}
