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
  loadAllTodos(): Observable<todoCore.repositories.TodoListState> {
    console.log('foo');

    if (this.#todoListState$.value.loading) {
      return this.#todoListState$;
    }

    this.#emitTodoListState({ loading: true, error: null });

    this.remoteDataSource
      .getAllTodos()
      .then(todos => {
        this.localTodoListDataSource.setAllTodos(todos);
        this.#emitTodoListState({ loading: false, data: this.localTodoListDataSource.getAllTodos() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message });
      });

    return this.#todoListState$;
  }

  create(todo: todoCore.entities.Todo): void {
    this.#emitTodoListState({ loading: true, error: null });

    this.remoteDataSource
      .createTodo(todo)
      .then(() => {
        // update local list
        this.localTodoListDataSource.create(todo);

        // emit updated local list
        this.#emitTodoListState({ loading: false, data: this.localTodoListDataSource.getAllTodos() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message });
      });
  }

  update(todo: todoCore.entities.Todo): void {
    this.#emitTodoListState({ loading: true, error: null });

    this.remoteDataSource
      .updateTodo(todo)
      .then(() => {
        // update local todo
        this.localTodoListDataSource.update(todo);

        // emit updated local todo
        this.#emitTodoListState({ loading: false, data: this.localTodoListDataSource.getAllTodos() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.update(null);

        this.#emitTodoListState({ loading: false, error: error.message });
      });
  }

  reorder(from: number, to: number): void {
    this.#emitTodoListState({ loading: true, error: null });

    this.remoteDataSource
      .reorderTodo(from, to)
      .then(() => {
        // update local list
        this.localTodoListDataSource.reorder(from, to);

        // emit updated local list
        this.#emitTodoListState({ loading: false, data: this.localTodoListDataSource.getAllTodos() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message });
      });
  }

  delete(id: number): void {
    this.#emitTodoListState({ loading: true, error: null });

    this.remoteDataSource
      .deleteTodo(id)
      .then(() => {
        // update local list
        this.localTodoListDataSource.delete(id);

        // emit updated local list
        this.#emitTodoListState({ loading: false, data: this.localTodoListDataSource.getAllTodos() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message });
      });
  }

  #emitTodoListState(newState: Partial<todoCore.repositories.TodoListState>) {
    this.#todoListState$.next({ ...this.#todoListState$.getValue(), ...newState });
  }
}
