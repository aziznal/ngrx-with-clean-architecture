import { NgModule, Provider } from '@angular/core';
import { todoCore as todoCore } from '@core';
import { todoData as todoData } from '@data';

const providers: Provider[] = [
  // Data Source injections
  {
    provide: todoData.dataSources.LocalTodoListDataSource,
    useFactory: () => new todoData.dataSources.LocalTodoListDataSourceImpl(),
  },
  {
    provide: todoData.dataSources.LocalTodoDataSource,
    useFactory: () => new todoData.dataSources.LocalTodoDataSourceImpl(),
  },
  {
    provide: todoData.dataSources.RemoteTodoDataSource,
    useFactory: () => new todoData.dataSources.RemoteTodoDataSourceImpl(),
  },

  // Repository injections
  {
    provide: todoCore.repositories.TodoRepository,
    useFactory: (
      remoteDataSource: todoData.dataSources.RemoteTodoDataSource,
      localDataSource: todoData.dataSources.LocalTodoDataSource,
      localTodoListDataSource: todoData.dataSources.LocalTodoListDataSource,
    ) => new todoData.repositories.TodoRepositoryImpl(remoteDataSource, localDataSource, localTodoListDataSource),
    deps: [
      todoData.dataSources.RemoteTodoDataSource,
      todoData.dataSources.LocalTodoListDataSource,
      todoData.dataSources.LocalTodoListDataSource,
    ],
  },

  // Usecase injections
  {
    provide: todoCore.usecases.GetAllTodosUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.GetAllTodosImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
];

@NgModule()
export class DependencyInjectionModule {
  static hasBeenInitialized = false;

  static forRoot() {
    if (this.hasBeenInitialized) {
      throw new Error('DependencyInjectionModule has already been initialized');
    }

    this.hasBeenInitialized = true;

    return {
      ngModule: DependencyInjectionModule,
      providers: [...providers],
    };
  }
}
