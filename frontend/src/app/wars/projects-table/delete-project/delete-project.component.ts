import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectsService } from '@shared/providers/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from '@shared/helpers/error-handler';
import { ActivatedRoute } from '@angular/router';
import { ProjectType } from '@monorepo/interfaces/project/projects-query.dto.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteProjectComponent {
  ProjectType = ProjectType;
  processed = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string, id: number, type: ProjectType},
              private dialogRef: MatDialogRef<DeleteProjectComponent>,
              private projects: ProjectsService,
              private snackBar: MatSnackBar,
              public route: ActivatedRoute) {}

  delete(): void {
    this.processed = true;

    const action: Observable<unknown> = this.data.type === ProjectType.my
      ? this.projects.delete(this.data.id)
      : this.projects.removeAccess(this.data.id);
    action.subscribe({
        next: () => {
          this.processed = false;
          this.snackBar.open(
            this.data.type === ProjectType.my ? 'Project has been deleted' : 'Access has been removed',
            null,
            {panelClass: 'success'});
          this.dialogRef.close();
        },
        error: ({error}) => {
          this.processed = false;
          handleError(this.snackBar, error);
        },
      });
  }
}
