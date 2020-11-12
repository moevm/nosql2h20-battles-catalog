import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectsService } from '@shared/providers/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { handleError } from '@shared/helpers/error-handler';
import { ProjectType } from '@monorepo/interfaces/project/projects-query.dto.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-delete-projects',
  templateUrl: './delete-projects.component.html',
  styleUrls: ['./delete-projects.component.scss']
})
export class DeleteProjectsComponent {
  ProjectType = ProjectType;
  processed = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {ids: number[], type: ProjectType},
              private dialogRef: MatDialogRef<DeleteProjectsComponent>,
              private projects: ProjectsService,
              private snackBar: MatSnackBar,
              public route: ActivatedRoute) {}

  delete(): void {
    this.processed = true;

    const action: Observable<unknown> = this.data.type === ProjectType.my
      ? this.projects.delete(this.data.ids)
      : this.projects.removeMyAccesses(this.data.ids);
    action.subscribe({
      next: () => {
        this.processed = false;
        this.snackBar.open(
          this.data.type === ProjectType.my ? 'Projects have been deleted' : 'Accesses have been removed',
          null,
          {panelClass: 'success'});
        this.dialogRef.close(true);
      },
      error: ({error}) => {
        this.processed = false;
        handleError(this.snackBar, error);
      }
    });
  }
}
