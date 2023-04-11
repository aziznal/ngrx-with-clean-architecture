import { BehaviorSubject, Observable } from 'rxjs';

import { todoCore } from '@core';

import { LocalTodoDataSource, LocalTodoListDataSource, RemoteTodoDataSource } from '../data-sources';

export class TodoRepositoryImpl implements todoCore.repositories.TodoRepository {
  #todoListState$ = new BehaviorSubject<todoCore.repositories.TodoListState>({
    loading: false,
    error: null,
    data: null,
  });

  #todoState$ = new BehaviorSubject<todoCore.repositories.TodoState>({
    loading: false,
    error: null,
    data: null,
  });

  get todoListState$(): Observable<todoCore.repositories.TodoListState> {
    return this.#todoListState$;
  }

  get todoState$(): Observable<todoCore.repositories.TodoState> {
    return this.#todoState$;
  }

  constructor(
    private readonly remote: RemoteTodoDataSource,
    private readonly localList: LocalTodoListDataSource,
    private readonly local: LocalTodoDataSource,
  ) {}

  // get methods always fetch from remote first, then update local, then return
  // an observable. This way, consequent calls to create, delete, and reorder
  // can modify local and return it without having to call remote again.
  async loadAllTodos(): Promise<void> {
    // loading is set to true in this one because it's the first call to remote
    this.#emitTodoListState({ loading: true, error: null });

    await this.remote
      .getAllTodos()
      .then(todos => {
        this.localList.setAllTodos(todos);
        this.#emitTodoListState({ loading: false, data: this.localList.getAllTodos(), error: null });
      })
      .catch(error => {
        // reset cache on error
        this.localList.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message });
      });
  }

  async loadTodoById(id: number): Promise<void> {
    this.#emitTodoState({ loading: true, error: null });

    await this.remote
      .getTodoById(id)
      .then(todo => {
        this.local.update(todo);
        this.localList.update(todo);

        this.#emitTodoState({ loading: false, data: this.local.getTodo(), error: null });
      })
      .catch(error => {
        this.local.update(null);
        this.localList.update(null);

        this.#emitTodoState({ loading: false, error: error.message });
      });
  }

  async create(todo: todoCore.entities.Todo): Promise<void> {
    this.#emitTodoListState({ error: null, loading: true });

    // optimistic update
    this.localList.create(todo);
    this.#emitTodoListState({ data: this.localList.getAllTodos() });

    await this.remote
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
    this.localList.update(todo);

    // also update local-todo if it's the same todo
    if (this.local.getTodo()?.id === todo.id) {
      this.local.update(todo);
    }

    this.#emitTodoListState({ data: this.localList.getAllTodos() });
    this.#emitTodoState({ data: this.local.getTodo() });

    await this.remote
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
    this.localList.reorder(from, to);
    this.#emitTodoListState({ data: this.localList.getAllTodos() });

    await this.remote
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
    this.localList.delete(id);

    // also update local-todo if it's the same todo
    if (this.local.getTodo()?.id === id) {
      this.local.update(null);
    }

    this.#emitTodoListState({ data: this.localList.getAllTodos() });
    this.#emitTodoState({ data: this.local.getTodo() });

    await this.remote
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

  #emitTodoState(newState: Partial<todoCore.repositories.TodoState>) {
    this.#todoState$.next({ ...this.#todoState$.getValue(), ...newState });
  }
}
