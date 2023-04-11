import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CanDeactivateComponent } from '../../guards/can-decativate-component.template';

@Component({
  templateUrl: './todo-details-page.component.html',
  styleUrls: ['./todo-details-page.component.scss'],
})
export class TodoDetailsPageComponent implements OnInit, CanDeactivateComponent {
  id!: number;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (this.id === null || this.id === undefined) {
      alert('Invalid todo id');

      this.router.navigateByUrl('/todo');
    }
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    return true;
  }
}
