import { moveItemInArray } from '@angular/cdk/drag-drop';

import { todoCore } from '@core';

const artificalDelay = 1000;

/**
 * ## Description
 *
 * This is a mock implementation of a remote data source.
 *
 * This file is irrelevant to the core concepts of this project. It simply
 * mimics a remote data source.
 *
 * Don't let the fact that it uses the browser's local storage confuse you. It's
 * just a mock.
 */

export abstract class RemoteTodoDataSource {
  abstract getAllTodos(): Promise<todoCore.entities.Todo[]>;

  abstract getTodoById(id: number): Promise<todoCore.entities.Todo>;

  abstract createTodo(todoItem: todoCore.entities.Todo): Promise<todoCore.entities.Todo>;

  abstract updateTodo(todoItem: todoCore.entities.Todo): Promise<todoCore.entities.Todo>;

  abstract deleteTodo(id: number): Promise<void>;

  abstract reorderTodo(from: number, to: number): Promise<void>;
}

export class RemoteTodoDataSourceImpl implements RemoteTodoDataSource {
  async getAllTodos(): Promise<todoCore.entities.Todo[]> {
    await this.#sleep(artificalDelay);

    return this.#getFromStorage();
  }

  async getTodoById(id: number): Promise<todoCore.entities.Todo> {
    await this.#sleep(artificalDelay);

    const todo = this.#getFromStorage().find(item => item.id === +id);

    if (!todo) {
      throw new Error('404');
    }

    return todo;
  }

  async createTodo(todoItem: todoCore.entities.Todo): Promise<todoCore.entities.Todo> {
    await this.#sleep(artificalDelay);

    this.#saveToStorage([...this.#getFromStorage(), todoItem]);

    return todoItem;
  }

  async updateTodo(todoItem: todoCore.entities.Todo): Promise<todoCore.entities.Todo> {
    await this.#sleep(artificalDelay);

    const index = this.#getFromStorage().findIndex(item => item.id === todoItem.id);

    if (index === -1) {
      throw new Error('404');
    }

    this.#saveToStorage([
      ...this.#getFromStorage().slice(0, index),
      todoItem,
      ...this.#getFromStorage().slice(index + 1),
    ]);

    return todoItem;
  }

  async deleteTodo(id: number): Promise<void> {
    await this.#sleep(artificalDelay);

    const index = this.#getFromStorage().findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error('404');
    }

    this.#saveToStorage([...this.#getFromStorage().slice(0, index), ...this.#getFromStorage().slice(index + 1)]);
  }

  async reorderTodo(from: number, to: number): Promise<void> {
    await this.#sleep(artificalDelay);

    if (from === to) {
      return;
    }

    if (from < 0 || from >= this.#getFromStorage().length) {
      throw new Error('Invalid "from" index');
    }

    if (to < 0 || to >= this.#getFromStorage().length) {
      throw new Error('Invalid "to" index');
    }

    const updatedTodos = [...this.#getFromStorage()];

    moveItemInArray(updatedTodos, from, to);

    this.#saveToStorage(updatedTodos);
  }

  // helper to simulate latency
  #sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  #getFromStorage(): todoCore.entities.Todo[] {
    return JSON.parse(localStorage.getItem('todoItems') || '[]');
  }

  #saveToStorage(todoItems: todoCore.entities.Todo[]): void {
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
  }
}
