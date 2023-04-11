import { BehaviorSubject, Observable } from 'rxjs';

import { todoCore } from '@core';

import { LocalTodoListDataSource, RemoteTodoDataSource } from '../data-sources';

export class TodoListRepositoryImpl implements todoCore.repositories.TodoListRepository {
  #todoListState$ = new BehaviorSubject<todoCore.repositories.TodoListState>({
    loading: false,
    error: null,
    data: null,
  });

  get todoListState$(): Observable<todoCore.repositories.TodoListState> {
    return this.#todoListState$;
  }

  constructor(
    private readonly remoteDataSource: RemoteTodoDataSource,
    private readonly localTodoListDataSource: LocalTodoListDataSource,
  ) {}

  // get methods always fetch from remote first, then update local, then return
  // an observable. This way, consequent calls to create, delete, and reorder
  // can modify local and return it without having to call remote again.
  async loadAllTodos(): Promise<void> {
    // loading is set to true in this one because it's the first call to remote
    this.#emitTodoListState({ loading: true, error: null });

    await this.remoteDataSource
      .getAllTodos()
      .then(todos => {
        this.localTodoListDataSource.setAllTodos(todos);
        this.#emitTodoListState({ loading: false, data: this.localTodoListDataSource.getAllTodos(), error: null });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message });
      });
  }

  async create(todo: todoCore.entities.Todo): Promise<void> {
    this.#emitTodoListState({ error: null, loading: true });

    // optimistic update
    this.localTodoListDataSource.create(todo);
    this.#emitTodoListState({ data: this.localTodoListDataSource.getAllTodos() });

    await this.remoteDataSource
      .createTodo(todo)
      .then(() => {
        this.#emitTodoListState({ loading: false });
      })
      .catch(error => {
        this.loadAllTodos(); // reset cache on error
        this.#emitTodoListState({ loading: false, error: error.message });
      });
  }

  async update(todo: todoCore.entities.Todo): Promise<void> {
    this.#emitTodoListState({ error: null, loading: true });

    // optimistic update
    this.localTodoListDataSource.update(todo);
    this.#emitTodoListState({ data: this.localTodoListDataSource.getAllTodos() });

    await this.remoteDataSource
      .updateTodo(todo)
      .then(() => {
        this.#emitTodoListState({ loading: false });
      })
      .catch(error => {
        this.loadAllTodos(); // reset cache on error
        this.#emitTodoListState({ loading: false, error: error.message });
      });
  }

  async reorder(from: number, to: number): Promise<void> {
    this.#emitTodoListState({ error: null, loading: true });

    // optimistic update
    this.localTodoListDataSource.reorder(from, to);
    this.#emitTodoListState({ data: this.localTodoListDataSource.getAllTodos() });

    await this.remoteDataSource
      .reorderTodo(from, to)
      .then(() => {
        this.#emitTodoListState({ loading: false });
      })
      .catch(error => {
        this.#emitTodoListState({ error: error.message });
        this.loadAllTodos(); // reset cache on error
      });
  }

  async delete(id: number): Promise<void> {
    this.#emitTodoListState({ error: null, loading: true });

    // optimistic update
    this.localTodoListDataSource.delete(id);
    this.#emitTodoListState({ data: this.localTodoListDataSource.getAllTodos() });

    await this.remoteDataSource
      .deleteTodo(id)
      .then(() => {
        this.#emitTodoListState({ loading: false });
      })
      .catch(error => {
        this.#emitTodoListState({ error: error.message });
        this.loadAllTodos(); // reset cache on error
      });
  }

  #emitTodoListState(newState: Partial<todoCore.repositories.TodoListState>) {
    this.#todoListState$.next({ ...this.#todoListState$.getValue(), ...newState });
  }
}
