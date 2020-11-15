import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateBattleFormService {
  private readonly $allActors = new BehaviorSubject<string[]>([]);
  readonly allActors = this.$allActors.asObservable();

  get(): void {
    this.$allActors.next(['France', 'Serega lox', 'Zimbabve']);
  }
}
