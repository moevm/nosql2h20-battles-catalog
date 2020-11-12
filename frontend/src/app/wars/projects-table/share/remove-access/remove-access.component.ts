import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectsService } from '@shared/providers/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from '@shared/helpers/error-handler';

@Component({
  selector: 'app-remove-access',
  templateUrl: './remove-access.component.html'
})
export class RemoveAccessComponent {
  processed = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: number, projectName: string, userName: string},
              private projects: ProjectsService,
              private dialogRef: MatDialogRef<RemoveAccessComponent>,
              private snackBar: MatSnackBar) {}

  remove(): void {
    const {id, projectName, userName} = this.data;

    this.processed = true;
    this.projects.removeAccess(id)
      .subscribe({
        next: () => {
          this.processed = false;
          this.snackBar.open(`Access to ${projectName} has been removed to ${userName}`, null, {panelClass: 'success'});
          this.dialogRef.close(true);
        },
        error: ({error}) => {
          this.processed = false;
          handleError(this.snackBar, error.message);
        },
      });
  }
}
