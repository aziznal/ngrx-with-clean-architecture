import { Component } from '@angular/core';
import { todoCore } from '@core';
import { map, tap } from 'rxjs';
import { CanDeactivateComponent } from '../../guards/can-decativate-component.template';

@Component({
  templateUrl: './todo-list-page.component.html',
  styleUrls: ['./todo-list-page.component.scss'],
})
export class TodoListPageComponent implements CanDeactivateComponent {
  state$? = this.getTodosUsecase.execute().pipe(
    tap(state => {
      if (state.error) {
        alert(state.error);
      }
    }),
  );

  canDeactivate() {
    if (!this.state$) return true;

    return this.state$.pipe(
      map(state => {
        if (state.loading) {
          return confirm('Are you sure you want to leave? Progress will be lost.');
        }

        return true;
      }),
    );
  }

  constructor(
    public getTodosUsecase: todoCore.usecases.GetAllTodosUsecase,
    public createTodoUsecase: todoCore.usecases.CreateTodoInListUsecase,
    public updateTodoUsecase: todoCore.usecases.UpdateTodoInListUsecase,
    public deleteTodoUsecase: todoCore.usecases.DeleteTodoInListUsecase,
    public reorderTodoUsecase: todoCore.usecases.ReorderTodoInListUsecase,
  ) {}

  trackByFn(index: number, item: todoCore.entities.Todo) {
    return item.id;
  }
}
