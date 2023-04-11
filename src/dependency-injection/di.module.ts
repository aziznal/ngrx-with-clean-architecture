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
    provide: todoCore.repositories.TodoListRepository,
    useFactory: (
      remoteDataSource: todoData.dataSources.RemoteTodoDataSource,
      localTodoListDataSource: todoData.dataSources.LocalTodoListDataSource,
    ) => new todoData.repositories.TodoListRepositoryImpl(remoteDataSource, localTodoListDataSource),
    deps: [todoData.dataSources.RemoteTodoDataSource, todoData.dataSources.LocalTodoListDataSource],
  },
  {
    provide: todoCore.repositories.TodoRepository,
    useFactory: (
      remoteDataSource: todoData.dataSources.RemoteTodoDataSource,
      localDataSource: todoData.dataSources.LocalTodoDataSource,
    ) => new todoData.repositories.TodoRepositoryImpl(remoteDataSource, localDataSource),
    deps: [todoData.dataSources.RemoteTodoDataSource, todoData.dataSources.LocalTodoDataSource],
  },

  // Usecase injections
  {
    provide: todoCore.usecases.GetAllTodosUsecase,
    useFactory: (repo: todoCore.repositories.TodoListRepository) => new todoCore.usecases.GetAllTodosImpl(repo),
    deps: [todoCore.repositories.TodoListRepository],
  },
  {
    provide: todoCore.usecases.GetTodoByIdUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.GetTodoByIdUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.CreateTodoInListUsecase,
    useFactory: (repo: todoCore.repositories.TodoListRepository) =>
      new todoCore.usecases.CreateTodoInListUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoListRepository],
  },
  {
    provide: todoCore.usecases.DeleteTodoInListUsecase,
    useFactory: (repo: todoCore.repositories.TodoListRepository) =>
      new todoCore.usecases.DeleteTodoInListUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoListRepository],
  },
  {
    provide: todoCore.usecases.UpdateTodoInListUsecase,
    useFactory: (repo: todoCore.repositories.TodoListRepository) =>
      new todoCore.usecases.UpdateTodoInListUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoListRepository],
  },
  {
    provide: todoCore.usecases.ReorderTodoInListUsecase,
    useFactory: (repo: todoCore.repositories.TodoListRepository) =>
      new todoCore.usecases.ReorderTodoInListUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoListRepository],
  },
];

@NgModule()
export class DependencyInjectionModule {
  static forRoot() {
    return {
      ngModule: DependencyInjectionModule,
      providers: [...providers],
    };
  }
}
