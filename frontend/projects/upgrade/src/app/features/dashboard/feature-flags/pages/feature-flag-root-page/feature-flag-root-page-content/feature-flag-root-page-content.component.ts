import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonSectionCardListComponent } from '../../../../../../shared-standalone-component-lib/components';
import { FeatureFlagsDataService_LEGACY } from '../../../../../../core/feature-flags_LEGACY/feature-flags.data.service._LEGACY';

@Component({
  selector: 'app-feature-flag-root-page-content',
  standalone: true,
  imports: [CommonSectionCardListComponent],
  providers: [FeatureFlagsDataService_LEGACY],
  templateUrl: './feature-flag-root-page-content.component.html',
  styleUrl: './feature-flag-root-page-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureFlagRootPageContentComponent {}
