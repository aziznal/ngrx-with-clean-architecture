import { todoCore } from '@core';
import { Observable, tap } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CanDeactivateComponent } from '../../guards/can-decativate-component.template';

@Component({
  templateUrl: './todo-details-page.component.html',
  styleUrls: ['./todo-details-page.component.scss'],
})
export class TodoDetailsPageComponent implements OnInit, CanDeactivateComponent {
  id!: number;

  state$?: Observable<todoCore.repositories.TodoState>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,

    private getTodoByIdUsecase: todoCore.usecases.GetTodoByIdUsecase,
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];

    if (this.id === null || this.id === undefined) {
      alert('Invalid todo id');
      this.router.navigateByUrl('/todo');
    }

    this.state$ = this.getTodoByIdUsecase.execute(this.id).pipe(
      tap(state => {
        if (state.error) {
          alert('Something went wrong. ' + state.error);
        }
      }),
    );
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    return true;
  }
}
