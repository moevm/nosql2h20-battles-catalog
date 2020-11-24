import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss']
})
export class ExportModalComponent {
  uploadUrl = `${environment.baseUrl}/upload`;

  constructor(private http: HttpClient) {}

  onFilesChange(e: any): void {
    const formData = new FormData();
    formData.append('files', e.target.files[0]);
    formData.append('files', e.target.files[1]);
    this.http.post('upload', formData).subscribe(() => location.reload());
  }
}
