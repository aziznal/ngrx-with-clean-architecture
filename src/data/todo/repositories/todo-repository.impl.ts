import { BehaviorSubject, Observable } from 'rxjs';

import { todoCore } from '@core';

import { LocalTodoDataSource, LocalTodoListDataSource, RemoteTodoDataSource } from '../data-sources';

export class TodoRepositoryImpl implements todoCore.repositories.TodoRepository {
  todoListState$ = new BehaviorSubject<todoCore.repositories.TodoListState>({
    loading: false,
    error: null,
    data: null,
  });
  todoState$ = new BehaviorSubject<todoCore.repositories.TodoState>({ loading: false, error: null, data: null });

  constructor(
    private readonly remoteDataSource: RemoteTodoDataSource,
    private readonly localTodoDataSource: LocalTodoDataSource,
    private readonly localTodoListDataSource: LocalTodoListDataSource,
  ) {}

  // get methods always fetch from remote first, then update local, then return
  // an observable. This way, consequent calls to create, delete, and reorder
  // can modify local and return it without having to call remote again.
  getAllTodos(): Observable<todoCore.repositories.TodoListState> {
    this.#emitTodoListState({ loading: true, error: null, data: null });

    this.remoteDataSource
      .getAllTodos()
      .then(todos => {
        this.localTodoListDataSource.setAllTodos(todos);
        this.#emitTodoListState({ loading: false, error: null, data: todos });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message, data: null });
      });

    return this.todoListState$;
  }

  // get methods always fetch from remote first, then update local, then return
  // an observable. This way, consequent calls to update can modify local and
  // return it without having to call remote again.
  getTodoById(id: number): Observable<todoCore.repositories.TodoState> {
    this.#emitTodoState({ loading: true, error: null, data: null });

    this.remoteDataSource
      .getTodoById(id)
      .then(todo => {
        // update local todo
        this.localTodoDataSource.update(todo);

        // emit updated local todo
        this.#emitTodoState({ loading: false, error: null, data: this.localTodoDataSource.getTodo() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoDataSource.update(null);

        this.#emitTodoState({ loading: false, error: error.message, data: null });
      });

    return this.todoState$;
  }

  create(todo: todoCore.entities.Todo): void {
    this.#emitTodoListState({ loading: true, error: null, data: null });

    this.remoteDataSource
      .createTodo(todo)
      .then(() => {
        // update local list
        this.localTodoListDataSource.create(todo);

        // emit updated local list
        this.#emitTodoListState({ loading: false, error: null, data: this.localTodoListDataSource.getAllTodos() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message, data: null });
      });
  }

  update(todo: todoCore.entities.Todo): void {
    this.#emitTodoState({ loading: true, error: null, data: null });

    this.remoteDataSource
      .updateTodo(todo)
      .then(() => {
        // update local todo
        this.localTodoDataSource.update(todo);

        // emit updated local todo
        this.#emitTodoState({ loading: false, error: null, data: this.localTodoDataSource.getTodo() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoDataSource.update(null);

        this.#emitTodoState({ loading: false, error: error.message, data: null });
      });
  }

  reorder(from: number, to: number): void {
    this.#emitTodoListState({ loading: true, error: null, data: null });

    this.remoteDataSource
      .reorderTodo(from, to)
      .then(() => {
        // update local list
        this.localTodoListDataSource.reorder(from, to);

        // emit updated local list
        this.#emitTodoListState({ loading: false, error: null, data: this.localTodoListDataSource.getAllTodos() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message, data: null });
      });
  }

  delete(id: number): void {
    this.#emitTodoListState({ loading: true, error: null, data: null });

    this.remoteDataSource
      .deleteTodo(id)
      .then(() => {
        // update local list
        this.localTodoListDataSource.delete(id);

        // emit updated local list
        this.#emitTodoListState({ loading: false, error: null, data: this.localTodoListDataSource.getAllTodos() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoListDataSource.setAllTodos(null);

        this.#emitTodoListState({ loading: false, error: error.message, data: null });
      });
  }

  #emitTodoListState(newState: Partial<todoCore.repositories.TodoListState>) {
    this.todoListState$.next({ ...this.todoListState$.getValue(), ...newState });
  }

  #emitTodoState(newState: Partial<todoCore.repositories.TodoState>) {
    this.todoState$.next({ ...this.todoState$.getValue(), ...newState });
  }
}
