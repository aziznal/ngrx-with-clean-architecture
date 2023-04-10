import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DependencyInjectionModule } from '../dependency-injection/di.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoPageComponent } from './screens/todo-page/todo-page.component';

import { DisabledDirective } from './directives/disabled-overlay.directive';

@NgModule({
  declarations: [AppComponent, TodoPageComponent, TodoItemComponent, DisabledDirective],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    DependencyInjectionModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
