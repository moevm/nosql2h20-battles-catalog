import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectsService } from '@shared/providers/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from '@shared/helpers/error-handler';

@Component({
  selector: 'app-share-projects',
  templateUrl: './share-projects.component.html',
  styleUrls: ['./share-projects.component.scss']
})
export class ShareProjectsComponent {
  processed = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {ids: number[]},
              private projects: ProjectsService,
              private dialogRef: MatDialogRef<ShareProjectsComponent>,
              private snackBar: MatSnackBar) {}

  share(email: string): void {
    this.processed = true;
    this.projects.shareProject(this.data.ids, email)
      .subscribe({
        next: () => {
          this.processed = false;
          this.snackBar.open(`Projects have been shared to ${email}`, null, {panelClass: 'success'});
          this.dialogRef.close();
        },
        error: ({error}) => {
          this.processed = false;
          handleError(this.snackBar, error.message);
        },
      });
  }
}
