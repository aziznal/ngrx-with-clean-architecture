import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from './guards/can-deactivate.guard';

import { TodoDetailsPageComponent } from './screens/todo-details-page/todo-details-page.component';
import { TodoListPageComponent } from './screens/todo-list-page/todo-list-page.component';

const routes: Routes = [
  {
    path: 'todos',
    component: TodoListPageComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'todo/:id',
    component: TodoDetailsPageComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  // default path
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
