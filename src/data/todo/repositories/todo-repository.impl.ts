import { BehaviorSubject, Observable } from 'rxjs';

import { todoCore } from '@core';
import { LocalTodoDataSource, RemoteTodoDataSource } from '../data-sources';

export class TodoRepositoryImpl implements todoCore.repositories.TodoRepository {
  #todoState$ = new BehaviorSubject<todoCore.repositories.TodoState>({ loading: false, error: null, data: null });

  get todoState$(): Observable<todoCore.repositories.TodoState> {
    return this.#todoState$;
  }

  constructor(
    private readonly remoteDataSource: RemoteTodoDataSource,
    private readonly localTodoDataSource: LocalTodoDataSource,
  ) {}

  // get methods always fetch from remote first, then update local, then return
  // an observable. This way, consequent calls to update can modify local and
  // return it without having to call remote again.
  loadTodoById(id: number): Observable<todoCore.repositories.TodoState> {
    this.#emitTodoState({ loading: true, error: null });

    this.remoteDataSource
      .getTodoById(id)
      .then(todo => {
        // update local todo
        this.localTodoDataSource.update(todo);

        // emit updated local todo
        this.#emitTodoState({ loading: false, data: this.localTodoDataSource.getTodo() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoDataSource.update(null);

        this.#emitTodoState({ loading: false, error: error.message, data: null });
      });

    return this.#todoState$;
  }

  update(todo: todoCore.entities.Todo): void {
    this.#emitTodoState({ loading: true, error: null });

    this.remoteDataSource
      .updateTodo(todo)
      .then(() => {
        // update local todo
        this.localTodoDataSource.update(todo);

        // emit updated local todo
        this.#emitTodoState({ loading: false, data: this.localTodoDataSource.getTodo() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoDataSource.update(null);

        this.#emitTodoState({ loading: false, error: error.message, data: null });
      });
  }

  delete(id: number): void {
    this.#emitTodoState({ loading: true, error: null });

    this.remoteDataSource
      .deleteTodo(id)
      .then(() => {
        // update local list
        this.localTodoDataSource.update(null);

        // emit updated local list
        this.#emitTodoState({ loading: false, data: this.localTodoDataSource.getTodo() });
      })
      .catch(error => {
        // reset cache on error
        this.localTodoDataSource.update(null);

        this.#emitTodoState({ loading: false, error: error.message, data: null });
      });
  }

  #emitTodoState(newState: Partial<todoCore.repositories.TodoState>) {
    this.#todoState$.next({ ...this.#todoState$.getValue(), ...newState });
  }
}
