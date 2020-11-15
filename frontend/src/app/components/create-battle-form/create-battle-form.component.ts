import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateBattleFormService } from './create-battle-form.service';

@Component({
  selector: 'app-create-battle-form',
  templateUrl: './create-battle-form.component.html',
  styleUrls: ['./create-battle-form.component.scss']
})
export class CreateBattleFormComponent {
  actorsData = new FormArray([]);

  form: FormGroup;

  constructor(public service: CreateBattleFormService) {
    service.get();

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      war: new FormControl('', Validators.required),
      actors: new FormControl([], control => control.value.length < 2 ? {minLength: true} : null),
      actorsData: this.actorsData
    });

    const startControl = new FormControl(null, Validators.required);
    const endControl = new FormControl(null, [
      ({value}) => value < startControl.value ? {lessThanStart: true} : null,
      Validators.required
    ]);
    this.form.addControl('start', startControl);
    this.form.addControl('end', endControl);
  }

  addActor(): void {
    this.actorsData.push(new FormGroup({
      isWinner: new FormControl(false),
      armyName: new FormControl(null, Validators.required),
      size: new FormControl(null, [Validators.min(1), Validators.required]),
      losses: new FormControl(null, Validators.min(1)),
      commanders: new FormControl('')
    }));
  }

  removeActor(actorIndex: number): void {
    this.actorsData.removeAt(actorIndex);
  }

  getActorFormGroup(i: number): FormGroup {
    return this.actorsData.at(i) as FormGroup;
  }

  onSubmit(): void {
    console.log(this.form.value);
  }
}
