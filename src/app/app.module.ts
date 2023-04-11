import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DependencyInjectionModule } from '../dependency-injection/di.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoListPageComponent } from './screens/todo-list-page/todo-list-page.component';

import { DisabledDirective } from './directives/disabled-overlay.directive';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoDetailsSectionComponent } from './screens/todo-details-section/todo-details-section.component';
@NgModule({
  declarations: [
    AppComponent,
    TodoListPageComponent,
    TodoDetailsSectionComponent,
    TodoItemComponent,
    DisabledDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatProgressSpinnerModule,
    DependencyInjectionModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
