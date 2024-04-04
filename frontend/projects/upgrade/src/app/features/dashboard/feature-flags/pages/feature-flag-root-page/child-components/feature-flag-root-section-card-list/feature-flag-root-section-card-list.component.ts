import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonSectionCardListComponent } from '../../../../../../../shared-standalone-component-lib/components/common-section-card-list/common-section-card-list.component';
import { FeatureFlagOverviewSectionCardComponent } from './child-components/feature-flag-overview-section-card/feature-flag-overview-section-card.component';

@Component({
  selector: 'app-feature-flag-root-section-card-list',
  standalone: true,
  templateUrl: './feature-flag-root-section-card-list.component.html',
  styleUrl: './feature-flag-root-section-card-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonSectionCardListComponent, FeatureFlagOverviewSectionCardComponent],
})
export class FeatureFlagRootSectionCardListComponent {}
