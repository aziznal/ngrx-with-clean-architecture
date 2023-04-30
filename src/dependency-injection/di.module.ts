import { NgModule, Provider } from '@angular/core';
import { todoCore as todoCore } from '@core';
import { todoData as todoData } from '@data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

const imports = [EffectsModule.forRoot(), StoreModule.forRoot({})];

const providers: Provider[] = [
  // Data Source injections
  {
    provide: todoData._datasources.RemoteTodoDataSource,
    useFactory: () => new todoData._datasources.RemoteTodoDataSourceImpl(),
  },

  // Repository injections
  {
    provide: todoCore.repositories.TodoRepository,
    useFactory: () => new todoData.TodoRepositoryImpl(),
    deps: [],
  },

  // Usecase injections
  {
    provide: todoCore.usecases.GetTodoListUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.GetTodoListImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.GetTodoByIdUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.GetTodoByIdUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.CreateTodoUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.CreateTodoUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.DeleteTodoUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.DeleteTodoUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.UpdateTodoUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.UpdateTodoUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.ReorderTodoUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.ReorderTodoUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
];

@NgModule()
export class DependencyInjectionModule {
  static forRoot() {
    return {
      ngModule: DependencyInjectionModule,
      imports: [...imports],
      providers: [...providers],
    };
  }
}
