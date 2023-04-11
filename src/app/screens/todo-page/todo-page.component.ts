import { Component } from '@angular/core';
import { todoCore } from '@core';

@Component({
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss'],
})
export class TodoPageComponent {
  state$? = this.getTodosUsecase.execute();

  constructor(
    public getTodosUsecase: todoCore.usecases.GetAllTodosUsecase,
    public createTodoUsecase: todoCore.usecases.CreateTodoInListUsecase,
    public updateTodoUsecase: todoCore.usecases.UpdateTodoInListUsecase,
    public deleteTodoUsecase: todoCore.usecases.DeleteTodoInListUsecase,
    public reorderTodoUsecase: todoCore.usecases.ReorderTodoInListUsecase,
  ) {}
}
