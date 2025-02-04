import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeatureFlagsService } from '../../../../../../../../core/feature-flags/feature-flags.service';
import { CommonDetailsParticipantListTableComponent } from '../../../../../../../../shared-standalone-component-lib/components/common-details-participant-list-table/common-details-participant-list-table.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-feature-flag-inclusions-table',
  standalone: true,
  templateUrl: './feature-flag-inclusions-table.component.html',
  styleUrl: './feature-flag-inclusions-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonDetailsParticipantListTableComponent, CommonModule, TranslateModule],
})
export class FeatureFlagInclusionsTableComponent {
  @Input() dataSource$ = this.featureFlagService.selectFeatureFlagInclusions$.pipe(
    tap((data) => console.log('>> inclusions table component', data))
  );
  isLoading$ = this.featureFlagService.isLoadingSelectedFeatureFlag$;

  constructor(private featureFlagService: FeatureFlagsService) {}
}
