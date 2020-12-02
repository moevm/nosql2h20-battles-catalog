import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateBattleFormService } from './create-battle-form.service';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { ActorsService } from 'src/app/actors.service';

@Component({
  selector: 'app-create-battle-form',
  templateUrl: './create-battle-form.component.html',
  styleUrls: ['./create-battle-form.component.scss']
})
export class CreateBattleFormComponent {
  actorsData = new FormArray([]);

  form: FormGroup;

  constructor(public service: ActorsService,
              private http: HttpClient,
              private dialogRef: MatDialogRef<CreateBattleFormComponent>) {
    // service.get();

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
    if (this.form.valid) {
      const value = this.form.value;
      this.http.post('battle/create', {
        name: value.name,
        war: value.war,
        start: value.start,
        end: value.end,
        actors: value.actors.map((actorName, i) => ({
          name: actorName,
          ...value.actorsData[i]
        }))
      }).subscribe(() => this.dialogRef.close());
    }
  }
}
