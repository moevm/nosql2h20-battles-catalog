import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectsService } from '@shared/providers/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from '@shared/helpers/error-handler';

@Component({
  selector: 'app-rename-project',
  templateUrl: './rename-project.component.html',
  styleUrls: ['./rename-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenameProjectComponent {
  processed = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string, id: number},
              private dialogRef: MatDialogRef<RenameProjectComponent>,
              private projects: ProjectsService,
              private snackBar: MatSnackBar) {}

  save(): void {
    this.processed = true;
    this.projects.edit(this.data.id, {name: this.data.name})
      .subscribe({
        next: () => {
          this.processed = false;
          this.snackBar.open('Project has been renamed', null, {panelClass: 'success'});
          this.dialogRef.close();
        },
        error: ({error}) => {
          this.processed = false;
          handleError(this.snackBar, error.message);
        },
      });
  }
}
