import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatConfirmDialogComponent } from '../components/mat-confirm-dialog/mat-confirm-dialog.component';
import { CommonFormDialogComponent } from '../components/common-form-dialog/common-form-dialog.component';
import { ExampleDialogFormTemplateComponent } from '../components/common-form-dialog/example-dialog-form-template/example-dialog-form.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog() {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: 'auto',
      disableClose: true,
    });
  }

  openExampleDialog() {
    // in real usage, we probably want to pass return the dialog ref to the component so it can subscribe to the result
    return this.dialog.open(CommonFormDialogComponent, {
      data: {
        title: 'Example Title',
        cancelBtnLabel: 'Example Cancel',
        primaryActionBtnLabel: 'Example Save',
        formComponent: ExampleDialogFormTemplateComponent, // change this to test different form modal templates
      },
      disableClose: true,
    });
  }
}
