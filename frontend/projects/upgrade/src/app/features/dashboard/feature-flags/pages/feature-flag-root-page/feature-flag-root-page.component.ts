import { Component } from '@angular/core';
import { CommonRootPageComponent } from '../../../../../shared-standalone-component-lib/components';
import { FeatureFlagRootPageHeaderComponent } from './feature-flag-root-page-header/feature-flag-root-page-header.component';
import { FeatureFlagRootPageContentComponent } from './feature-flag-root-page-content/feature-flag-root-page-content.component';
import { FeatureFlagsDataService_LEGACY } from '../../../../../core/feature-flags_LEGACY/feature-flags.data.service._LEGACY';

@Component({
  selector: 'app-feature-flag-root-page',
  standalone: true,
  templateUrl: './feature-flag-root-page.component.html',
  styleUrl: './feature-flag-root-page.component.scss',
  providers: [FeatureFlagsDataService_LEGACY],
  imports: [CommonRootPageComponent, FeatureFlagRootPageHeaderComponent, FeatureFlagRootPageContentComponent],
})
export class FeatureFlagRootPageComponent {
  constructor(private dataService: FeatureFlagsDataService_LEGACY) {
    console.log('hi hi hi hi');
    this.dataService
      .fetchFeatureFlags({
        skip: 0,
        take: 0,
      })
      .subscribe((res) => {
        console.log('res', res);
      });
  }
}
