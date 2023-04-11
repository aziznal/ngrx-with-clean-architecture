import { Observable } from 'rxjs';

export abstract class CanDeactivateComponent {
  abstract canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
}
