import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModalComponent } from '../../../../../shared-standalone-component-lib/components';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModalConfig } from '../../../../../shared-standalone-component-lib/components/common-modal/common-modal-config';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FeatureFlagsService } from '../../../../../core/feature-flags/feature-flags.service';
import { BehaviorSubject, Observable, Subscription, combineLatest, map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-feature-flag-modal',
  standalone: true,
  imports: [
    CommonModalComponent,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './delete-feature-flag-modal.component.html',
  styleUrl: './delete-feature-flag-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteFeatureFlagModalComponent {
  selectedFlag$ = this.featureFlagsService.selectedFeatureFlag$;
  inputValue = '';
  subscriptions = new Subscription();
  isSelectedFeatureFlagRemoved$ = this.featureFlagsService.isSelectedFeatureFlagRemoved$;
  IsLoadingFeatureFlagDelete$ = this.featureFlagsService.IsLoadingFeatureFlagDelete$;
  private inputSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // Observable that emits true if inputValue is 'delete', false otherwise
  isDeleteNotTyped$: Observable<boolean> = this.inputSubject.pipe(map((value) => value.toLowerCase() !== 'delete'));

  isDeleteActionBtnDisabled$: Observable<boolean> = combineLatest([
    this.isDeleteNotTyped$,
    this.IsLoadingFeatureFlagDelete$,
  ]).pipe(map(([isDeleteNotTyped, isLoading]) => isDeleteNotTyped || isLoading));

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: CommonModalConfig & { flagName: string; flagId: string },
    public dialog: MatDialog,
    private featureFlagsService: FeatureFlagsService,
    public dialogRef: MatDialogRef<DeleteFeatureFlagModalComponent>
  ) {}

  ngOnInit(): void {
    this.listenForSelectedFeatureFlagDeletion();
  }

  onInputChange(value: string): void {
    this.inputSubject.next(value);
  }

  listenForSelectedFeatureFlagDeletion(): void {
    this.subscriptions = this.isSelectedFeatureFlagRemoved$.subscribe(() => this.closeModal());
  }

  onPrimaryActionBtnClicked(flagId: string) {
    this.featureFlagsService.deleteFeatureFlag(flagId);
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
