import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModalComponent } from '../../../../../shared-standalone-component-lib/components';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModalConfig } from '../../../../../shared-standalone-component-lib/components/common-modal/common-modal-config';
import { FeatureFlagsService } from '../../../../../core/feature-flags/feature-flags.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-import-feature-flag-modal',
  standalone: true,
  imports: [CommonModalComponent, CommonModule, SharedModule],
  templateUrl: './import-feature-flag-modal.component.html',
  styleUrls: ['./import-feature-flag-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportFeatureFlagModalComponent {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  isImportActionBtnDisabled = new BehaviorSubject<boolean>(true);
  isDragOver = new BehaviorSubject<boolean>(false);
  fileName = new BehaviorSubject<string | null>(null);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: CommonModalConfig,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ImportFeatureFlagModalComponent>
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.next(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.next(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.next(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  processFile(file: File) {
    if (file.type === 'application/json') {
      this.fileName.next(file.name);
      this.isImportActionBtnDisabled.next(false);
      this.handleFileInput(file);
    } else {
      alert('Please upload a valid JSON file.');
      this.fileName.next(null);
      this.isImportActionBtnDisabled.next(true);
    }
  }

  handleFileInput(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const jsonContent = e.target.result;
      console.log(JSON.parse(jsonContent));
    };
    reader.readAsText(file);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
