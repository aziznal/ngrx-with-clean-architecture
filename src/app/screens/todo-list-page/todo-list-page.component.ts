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
    public getTodosUsecase: todoCore.usecases.GetTodoListUsecase,
    public createTodoUsecase: todoCore.usecases.CreateTodoUsecase,
    public updateTodoUsecase: todoCore.usecases.UpdateTodoUsecase,
    public deleteTodoUsecase: todoCore.usecases.DeleteTodoUsecase,
    public reorderTodoUsecase: todoCore.usecases.ReorderTodoUsecase,
  ) {}

  trackByFn(index: number, item: todoCore.entities.Todo) {
    return item.id;
  }
}
