import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import {
  NewExperimentDialogEvents,
  NewExperimentDialogData,
  NewExperimentPaths,
  ExperimentVM,
  ExperimentCondition,
  ExperimentPartition,
  IContextMetaData,
  EXPERIMENT_STATE,
} from '../../../../../core/experiments/store/experiments.model';
import { ExperimentFormValidators } from '../../validators/experiment-form.validators';
import { ExperimentService } from '../../../../../core/experiments/experiments.service';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, pairwise, startWith } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { DialogService } from '../../../../../shared/services/dialog.service';
import { ExperimentDesignStepperService } from '../../../../../core/experiment-design-stepper/experiment-design-stepper.service';
import { ExperimentAliasTableRow, ExperimentConditionAliasRequestObject } from '../../../../../core/experiment-design-stepper/store/experiment-design-stepper.model';

@Component({
  selector: 'home-factorial-experiment-design',
  templateUrl: './factorial-experiment-design.component.html',
  styleUrls: ['./factorial-experiment-design.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FactorialExperimentDesignComponent implements OnInit, OnChanges, OnDestroy {
  @Input() experimentInfo: ExperimentVM;
  @Input() currentContext: string;
  @Input() isContextChanged: boolean;
  @Input() animationCompleteStepperIndex: number;
  @Output() emitExperimentDialogEvent = new EventEmitter<NewExperimentDialogData>();

  @ViewChild('stepContainer', { read: ElementRef }) stepContainer: ElementRef;
  // @ViewChild('conditionTable', { read: ElementRef }) conditionTable: ElementRef;
  // @ViewChild('partitionTable', { read: ElementRef }) partitionTable: ElementRef;
  @ViewChild('factorTable', { read: ElementRef }) factorTable: ElementRef;
  // @ViewChild('conditionCode') conditionCode: ElementRef;

  factorialExperimentDesignForm: FormGroup;
  // conditionDataSource = new BehaviorSubject<AbstractControl[]>([]);
  // partitionDataSource = new BehaviorSubject<AbstractControl[]>([]);
  factorDataSource = new BehaviorSubject<AbstractControl[]>([]);
  factorsDataSource = ELEMENT_DATA;
  allFactors = [];
  allFactorsSub: Subscription;
  // allPartitions = [];
  // allPartitionsSub: Subscription;

  // Condition Errors
  conditionCountError: string;

  // Partition Errors
  partitionPointErrors = [];
  partitionErrorMessages = [];
  partitionErrorMessagesSub: Subscription;
  partitionCountError: string;

  previousAssignmentWeightValues = [];

  expandedId:number = null;

  factorDisplayedColumns = ['expandIcon','factor','site', 'target', 'removeFactor'];
  levelDisplayedColumns = ['level', 'alias', 'removeLevel'];

  // Used for condition code, experiment point and ids auto complete dropdown
  // filteredConditionCodes$: Observable<string[]>[] = [];
  filteredExpFactors$: Observable<string[]>[] = [];
  filteredExpPoints$: Observable<string[]>[] = [];
  filteredExpIds$: Observable<string[]>[] = [];
  filteredExpLevels$: Observable<string[]>[] = [];
  contextMetaData: IContextMetaData = {
    contextMetadata: {},
  };
  contextMetaDataSub: Subscription;
  expPointAndIdErrors: string[] = [];
  // conditionCodeErrors: string[] = [];
  equalWeightFlag = true;

  // Alias Table details
  designData$ = new BehaviorSubject<[ExperimentPartition[], ExperimentCondition[]]>([[], []]);
  designDataSub: Subscription;
  aliasTableData: ExperimentAliasTableRow[] = [];
  isAliasTableEditMode$: Observable<boolean>;
  isExperimentEditable = true;

  constructor(
    private _formBuilder: FormBuilder,
    private experimentService: ExperimentService,
    private translate: TranslateService,
    private dialogService: DialogService,
    public experimentDesignStepperService: ExperimentDesignStepperService
  ) {
    // this.partitionErrorMessagesSub = this.translate
    //   .get([
    //     'home.new-experiment.design.assignment-partition-error-1.text',
    //     'home.new-experiment.design.assignment-partition-error-2.text',
    //     'home.new-experiment.design.assignment-partition-error-3.text',
    //     'home.new-experiment.design.assignment-partition-error-4.text',
    //     'home.new-experiment.design.partition-point-selection-error.text',
    //     'home.new-experiment.design.partition-id-selection-error.text',
    //   ])
    //   .subscribe((translatedMessage) => {
    //     this.partitionErrorMessages = [
    //       translatedMessage['home.new-experiment.design.assignment-partition-error-1.text'],
    //       translatedMessage['home.new-experiment.design.assignment-partition-error-2.text'],
    //       translatedMessage['home.new-experiment.design.assignment-partition-error-3.text'],
    //       translatedMessage['home.new-experiment.design.assignment-partition-error-4.text'],
    //       translatedMessage['home.new-experiment.design.partition-point-selection-error.text'],
    //       translatedMessage['home.new-experiment.design.partition-id-selection-error.text'],
    //     ];
    //   });
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (
    //   changes.animationCompleteStepperIndex &&
    //   changes.animationCompleteStepperIndex.currentValue === 1 &&
    //   this.conditionCode
    // ) {
    //   this.conditionCode.nativeElement.focus();
    // }

    // if (this.isContextChanged) {
    //   this.isContextChanged = false;
    //   this.partition.clear();
    //   this.condition.clear();
    //   this.partitionDataSource.next(this.partition.controls);
    //   this.conditionDataSource.next(this.condition.controls);
    // }

    // this.applyEqualWeight();
  }

  ngOnInit() {
    this.contextMetaDataSub = this.experimentService.contextMetaData$.subscribe((contextMetaData) => {
      this.contextMetaData = contextMetaData;
    });
    // this.allPartitionsSub = this.experimentService.allPartitions$
    //   .pipe(filter((partitions) => !!partitions))
    //   .subscribe((partitions: any) => {
    //     this.allPartitions = partitions.map((partition) =>
    //       partition.target ? partition.site + partition.target : partition.site
    //     );
    //   });
    // this.allFactorsSub = this.experimentService.allPartitions$
    //   .pipe(filter((partitions) => !!partitions))
    //   .subscribe((partitions: any) => {
    //     this.allFactors = partitions.map((partition) =>
    //       partition.factors ? (partition.factors.map((factor) => partition.site + partition.target + factor.name )) 
    //         : (partition.target ? partition.site + partition.target : partition.site)
    //     );
    //   });
    this.factorialExperimentDesignForm = this._formBuilder.group({
        // conditions: this._formBuilder.array([this.addConditions()]),
        // partitions: this._formBuilder.array([this.addPartitions()]),
        factors: this._formBuilder.array([this.addFactors()]), 
      }
      // { validators: ExperimentFormValidators.validateExperimentDesignForm }
      // to do: create new form validator 
    );
    // this.createDesignDataSubject();
    // this.isAliasTableEditMode$ = this.experimentService.isAliasTableEditMode$;

    // populate values in form to update experiment if experiment data is available
    if (this.experimentInfo) {
      // this.equalWeightFlag = this.experimentInfo.conditions.every(
      //   (condition) => condition.assignmentWeight === this.experimentInfo.conditions[0].assignmentWeight
      // );
      // Remove previously added group of conditions and partitions
      // this.condition.removeAt(0);
      // this.partition.removeAt(0);
      // this.experimentInfo.conditions.forEach((condition) => {
      //   this.condition.push(
      //     this.addConditions(
      //       condition.conditionCode,
      //       condition.assignmentWeight,
      //       condition.description,
      //       condition.order
      //     )
      //   );
      // });
      // this.experimentInfo.partitions.forEach((partition) => {
      //   this.partition.push(
      //     this.addPartitions(
      //       partition.site,
      //       partition.target,
      //       partition.factors,
      //       partition.order,
      //       partition.excludeIfReached
      //     )
      //   );
      // });

      this.isExperimentEditable =
        this.experimentInfo.state !== this.ExperimentState.ENROLLING &&
        this.experimentInfo.state !== this.ExperimentState.ENROLLMENT_COMPLETE;

      // disable control on edit:
      if (!this.isExperimentEditable) {
        this.factorialExperimentDesignForm.disable();
      }
    }
    this.updateView();

    // // Bind predefined values of experiment conditionCode from backend
    // const conditionFormControl = this.factorialExperimentDesignForm.get('conditions') as FormArray;
    // conditionFormControl.controls.forEach((_, index) => {
    //   this.manageConditionCodeControl(index);
    // });

    // // Bind predefined values of experiment points and ids from backend
    // const partitionFormControl = this.factorialExperimentDesignForm.get('partitions') as FormArray;
    // partitionFormControl.controls.forEach((_, index) => {
    //   this.manageExpPointAndIdControl(index);
    // });

    // Bind predefined values of experiment factors from backend
    const factorFormControl = this.factorialExperimentDesignForm.get('factors') as FormArray;
    factorFormControl.controls.forEach((_, index) => {
      this.manageExpFactorPointAndIdControl(index);
    });

    // Bind predefined values of experiment factor's levels from backend
    // const levelFormControl = this.factorialExperimentDesignForm.get('levels') as FormArray;
    // levelFormControl.controls.forEach((_, index) => {
    //   this.manageExpLevelControl(index);
    // });

    // this.factorialExperimentDesignForm.get('partitions').valueChanges.subscribe((newValues) => {
    //   this.validatePartitionNames(newValues);
    // });
  }

  // manageConditionCodeControl(index: number) {
  //   const conditionFormControl = this.factorialExperimentDesignForm.get('conditions') as FormArray;
  //   this.filteredConditionCodes$[index] = conditionFormControl
  //     .at(index)
  //     .get('conditionCode')
  //     .valueChanges.pipe(
  //       startWith<string>(''),
  //       map((conditionCode) => this.filterConditionCodes(conditionCode))
  //     );
  //   this.applyEqualWeight();
  // }

  // manageExpPointAndIdControl(index: number) {
  //   const partitionFormControl = this.factorialExperimentDesignForm.get('partitions') as FormArray;
  //   this.filteredExpPoints$[index] = partitionFormControl
  //     .at(index)
  //     .get('site')
  //     .valueChanges.pipe(
  //       startWith<string>(''),
  //       map((site) => this.filterExpPointsAndIds(site, 'expPoints'))
  //     );
  //   this.filteredExpIds$[index] = partitionFormControl
  //     .at(index)
  //     .get('target')
  //     .valueChanges.pipe(
  //       startWith<string>(''),
  //       map((target) => this.filterExpPointsAndIds(target, 'expIds'))
  //     );
  // }

  manageExpFactorPointAndIdControl(index: number) {
    const factorFormControl = this.factorialExperimentDesignForm.get('factors') as FormArray;
    this.filteredExpFactors$[index] = factorFormControl
      .at(index)
      .get('factor')
      .valueChanges.pipe(
        startWith<string>(''),
        map((factor) => this.filterExpFactorsPointsAndIds(factor, 'expFactors'))
      );
    this.filteredExpPoints$[index] = factorFormControl
      .at(index)
      .get('site')
      .valueChanges.pipe(
        startWith<string>(''),
        map((site) => this.filterExpFactorsPointsAndIds(site, 'expPoints'))
      );
    this.filteredExpIds$[index] = factorFormControl
      .at(index)
      .get('target')
      .valueChanges.pipe(
        startWith<string>(''),
        map((target) => this.filterExpFactorsPointsAndIds(target, 'expIds'))
      );
  }

  manageExpLevelControl(index: number) {
    const levelFormControl = this.factorialExperimentDesignForm.get('levels') as FormArray;
    this.filteredExpLevels$[index] = levelFormControl
      .at(index)
      .get('level')
      .valueChanges.pipe(
        startWith<string>(''),
        map((level) => this.filterExpFactorsPointsAndIds(level, 'expLevels'))
      );
  }

  // createDesignDataSubject(): void {
  //   this.designDataSub = combineLatest([
  //     this.factorialExperimentDesignForm.get('partitions').valueChanges,
  //     this.factorialExperimentDesignForm.get('conditions').valueChanges,
  //   ])
  //     .pipe(
  //       pairwise(),
  //       filter((designData) => this.experimentDesignStepperService.filterForUnchangedDesignData(designData)),
  //       map(([_, current]) => current),
  //       filter((designData) => this.experimentDesignStepperService.validDesignDataFilter(designData))
  //     )
  //     .subscribe(this.designData$);
  // }

  handleAliasTableDataChange(aliasTableData: ExperimentAliasTableRow[]) {
    this.aliasTableData = [...aliasTableData];
  }

  // private filterConditionCodes(value: string): string[] {
  //   const filterValue = value ? value.toLocaleLowerCase() : '';

  //   if (!this.contextMetaData) {
  //     return [];
  //   }

  //   if (this.currentContext) {
  //     const currentContextConditionCode = this.contextMetaData.contextMetadata[this.currentContext].CONDITIONS || [];
  //     return currentContextConditionCode.filter((option) => option.toLowerCase().startsWith(filterValue));
  //   }
  //   return [];
  // }

  private filterExpFactorsPointsAndIds(value: string, key: string): string[] {
    const filterValue = value ? value.toLocaleLowerCase() : '';

    if (!this.contextMetaData) {
      return [];
    }

    if (key === 'expPoints' && this.currentContext) {
      const currentContextExpPoints = this.contextMetaData.contextMetadata[this.currentContext].EXP_POINTS || [];
      return currentContextExpPoints.filter((option) => option.toLowerCase().startsWith(filterValue));
    } else if (key === 'expIds' && this.currentContext) {
      const currentContextExpIds = this.contextMetaData.contextMetadata[this.currentContext].EXP_IDS || [];
      return currentContextExpIds.filter((option) => option.toLowerCase().startsWith(filterValue));
    }
    return [];
  }

  // addConditions(conditionCode = null, assignmentWeight = null, description = null, order = null) {
  //   return this._formBuilder.group({
  //     conditionCode: [conditionCode, Validators.required],
  //     assignmentWeight: [assignmentWeight, Validators.required],
  //     description: [description],
  //     order: [order],
  //   });
  // }

  // addPartitions(site = null, target = null, factors = null, order = null, excludeIfReached = false) {
  //   return this._formBuilder.group({
  //     site: [site, Validators.required],
  //     target: [target, Validators.required],
  //     factors: [factors, Validators.required],
  //     order: [order],
  //     excludeIfReached: [excludeIfReached],
  //   });
  // }

  addFactors( factor = null, site = null, target = null, level = null, alias = null) {
    return this._formBuilder.group({
      factor: [factor],
      site: [site],
      target: [target],
      levels: this._formBuilder.array([this.addLevels(level,alias)])
    });
  }

  addLevels( level = null, alias = null) {
    return this._formBuilder.group({
      level: [level],
      alias: [alias],
    });
  }

  // addConditionOrPartition(type: string) {
  //   const isPartition = type === 'partition';
  //   const form = isPartition ? this.addPartitions() : this.addConditions();
  //   this[type].push(form);
  //   const scrollTableType = isPartition ? 'partitionTable' : 'conditionTable';
  //   this.updateView(scrollTableType);
  //   if (isPartition) {
  //     const partitionFormControl = this.factorialExperimentDesignForm.get('partitions') as FormArray;
  //     this.manageExpPointAndIdControl(partitionFormControl.controls.length - 1);
  //   } else {
  //     const conditionFormControl = this.factorialExperimentDesignForm.get('conditions') as FormArray;
  //     this.manageConditionCodeControl(conditionFormControl.controls.length - 1);
  //   }
  // }

  addFactor(){
    console.log("hello add factor");
    const form = this.addFactors();
    this.factor.push(form);
    const scrollTableType = 'factorTable';
    this.updateView(scrollTableType);
    const factorFormControl = this.factorialExperimentDesignForm.get('factors') as FormArray;
    this.manageExpFactorPointAndIdControl(factorFormControl.controls.length - 1);
  }

  addLevel(){
    console.log("hello add level");
    const form = this.addLevels();
    this.level.push(form);
    const scrollTableType = 'levelTable';
    this.updateView(scrollTableType);
    const levelFormControl = this.factorialExperimentDesignForm.get('levels') as FormArray;
    this.manageExpLevelControl(levelFormControl.controls.length - 1);
  }

  // removeConditionOrPartition(type: string, groupIndex: number) {
  //   this[type].removeAt(groupIndex);
  //   if (type === 'condition' && this.experimentInfo) {
  //     const deletedCondition = this.experimentInfo.conditions.find((condition) => condition.order === groupIndex + 1);
  //     if (deletedCondition) {
  //       this.experimentInfo.conditions = this.experimentInfo.conditions.filter(
  //         (condition) => condition == deletedCondition
  //       );
  //       if (this.experimentInfo.revertTo === deletedCondition.id) {
  //         this.experimentInfo.revertTo = null;
  //       }
  //     }
  //   }
  //   if (type === 'condition') {
  //     this.previousAssignmentWeightValues.splice(groupIndex, 1);
  //     this.applyEqualWeight();
  //   }
  //   this.experimentDesignStepperService.experimentStepperDataChanged();
  //   this.updateView();
  // }

  removeFactor(groupIndex: number){
    console.log("hello remove");
  }

  expandFactor(index: number){
    this.expandedId = this.expandedId === index ? null : index;
  }

  updateView(type?: string) {
    // this.conditionDataSource.next(this.condition.controls);
    // this.partitionDataSource.next(this.partition.controls);
    if (type) {
      this[type].nativeElement.scroll({
        top: this[type].nativeElement.scrollHeight - 91,
        behavior: 'smooth',
      });
    }
  }

  // validatePartitionNames(partitions: any) {
  //   this.partitionPointErrors = [];
  //   // Used to differentiate errors
  //   const duplicatePartitions = [];

  //   // Used for updating existing experiment
  //   if (this.experimentInfo) {
  //     this.experimentInfo.partitions.forEach((partition) => {
  //       const partitionInfo = partition.target ? partition.site + partition.target : partition.site;
  //       const partitionPointIndex = this.allPartitions.indexOf(partitionInfo);
  //       if (partitionPointIndex !== -1) {
  //         this.allPartitions.splice(partitionPointIndex, 1);
  //       }
  //     });
  //   }

  //   partitions.forEach((partition, index) => {
  //     if (
  //       partitions.find(
  //         (value, partitionIndex) =>
  //           value.site === partition.site &&
  //           (value.target || '') === (partition.target || '') && // To match null and empty string, add '' as default value. target as optional and hence it's value can be null.
  //           partitionIndex !== index &&
  //           !duplicatePartitions.includes(
  //             partition.target ? partition.site + ' and ' + partition.target : partition.site
  //           )
  //       )
  //     ) {
  //       duplicatePartitions.push(partition.target ? partition.site + ' and ' + partition.target : partition.site);
  //     }
  //   });

  //   // Partition Points error messages
  //   if (duplicatePartitions.length === 1) {
  //     this.partitionPointErrors.push(duplicatePartitions[0] + this.partitionErrorMessages[2]);
  //   } else if (duplicatePartitions.length > 1) {
  //     this.partitionPointErrors.push(duplicatePartitions.join(', ') + this.partitionErrorMessages[3]);
  //   }
  // }

  // validateConditionCodes(conditions: ExperimentCondition[]) {
  //   const conditionUniqueErrorText = this.translate.instant(
  //     'home.new-experiment.design.condition-unique-validation.text'
  //   );
  //   const conditionCodes = conditions.map((condition) => condition.conditionCode);
  //   const hasUniqueConditionError = conditionCodes.length !== new Set(conditionCodes).size;
  //   if (hasUniqueConditionError && !this.conditionCodeErrors.includes(conditionUniqueErrorText)) {
  //     this.conditionCodeErrors.push(conditionUniqueErrorText);
  //   } else if (!hasUniqueConditionError) {
  //     const index = this.conditionCodeErrors.indexOf(conditionUniqueErrorText, 0);
  //     if (index > -1) {
  //       this.conditionCodeErrors.splice(index, 1);
  //     }
  //   }
  // }

  // validateHasConditionCodeDefault(conditions: ExperimentCondition[]) {
  //   const defaultKeyword = this.translate.instant('home.new-experiment.design.condition.invalid.text');
  //   const defaultConditionCodeErrorText = this.translate.instant(
  //     'home.new-experiment.design.condition-name-validation.text'
  //   );
  //   if (conditions.length) {
  //     const hasDefaultConditionCode = conditions.filter(
  //       (condition) =>
  //         typeof condition.conditionCode === 'string' && condition.conditionCode.toUpperCase().trim() === defaultKeyword
  //     );
  //     if (hasDefaultConditionCode.length && !this.conditionCodeErrors.includes(defaultConditionCodeErrorText)) {
  //       this.conditionCodeErrors.push(defaultConditionCodeErrorText);
  //     } else if (!hasDefaultConditionCode.length) {
  //       const index = this.conditionCodeErrors.indexOf(defaultConditionCodeErrorText, 0);
  //       if (index > -1) {
  //         this.conditionCodeErrors.splice(index, 1);
  //       }
  //     }
  //   }
  // }

  // validateHasAssignmentWeightsNegative(conditions: ExperimentCondition[]) {
  //   const negativeAssignmentWeightErrorText = this.translate.instant(
  //     'home.new-experiment.design.assignment-weight-negative.text'
  //   );
  //   if (conditions.length) {
  //     const hasNegativeAssignmentWeights = conditions.filter((condition) => condition.assignmentWeight < 0);
  //     if (
  //       hasNegativeAssignmentWeights.length &&
  //       !this.conditionCodeErrors.includes(negativeAssignmentWeightErrorText)
  //     ) {
  //       this.conditionCodeErrors.push(negativeAssignmentWeightErrorText);
  //     } else if (!hasNegativeAssignmentWeights.length) {
  //       const index = this.conditionCodeErrors.indexOf(negativeAssignmentWeightErrorText, 0);
  //       if (index > -1) {
  //         this.conditionCodeErrors.splice(index, 1);
  //       }
  //     }
  //   }
  // }

  // validateConditionCount(conditions: ExperimentCondition[]) {
  //   const conditionCountErrorMsg = this.translate.instant(
  //     'home.new-experiment.design.condition-count-new-exp-error.text'
  //   );
  //   if (
  //     conditions.length === 0 ||
  //     !conditions.every(
  //       (condition) =>
  //         typeof condition.conditionCode === 'string' &&
  //         condition.conditionCode.trim() &&
  //         condition.assignmentWeight !== null
  //     )
  //   ) {
  //     this.conditionCountError = conditionCountErrorMsg;
  //   } else {
  //     this.conditionCountError = null;
  //   }
  // }

  // validatePartitionCount(partitions: ExperimentPartition[]) {
  //   const partitionCountErrorMsg = this.translate.instant(
  //     'home.new-experiment.design.partition-count-new-exp-error.text'
  //   );
  //   if (
  //     partitions.length === 0 ||
  //     !partitions.every(
  //       (partition) =>
  //         typeof partition.site === 'string' &&
  //         partition.site.trim() &&
  //         typeof partition.target === 'string' &&
  //         partition.target.trim()
  //     )
  //   ) {
  //     this.partitionCountError = partitionCountErrorMsg;
  //   } else {
  //     this.partitionCountError = null;
  //   }
  // }

  // validatePartitions() {
  //   // Reset expPointAndIdErrors errors to re-validate data
  //   this.expPointAndIdErrors = [];
  //   const partitions: ExperimentPartition[] = this.factorialExperimentDesignForm.get('partitions').value;
  //   this.validateExpPoints(partitions);
  //   this.validateExpIds(partitions);
  // }

  // validateExpPoints(partitions: ExperimentPartition[]) {
  //   const sites = partitions.map((partition) => partition.site);
  //   const currentContextExpPoints = this.contextMetaData.contextMetadata[this.currentContext].EXP_POINTS;

  //   for (let siteIndex = 0; siteIndex < sites.length; siteIndex++) {
  //     if (!currentContextExpPoints.includes(sites[siteIndex])) {
  //       // Add partition point selection error
  //       this.expPointAndIdErrors.push(this.partitionErrorMessages[4]);
  //       break;
  //     }
  //   }
  // }

  // validateExpIds(partitions: ExperimentPartition[]) {
  //   const targets = partitions.map((partition) => partition.target).filter((target) => target);
  //   const currentContextExpIds = this.contextMetaData.contextMetadata[this.currentContext].EXP_IDS;

  //   for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
  //     if (!currentContextExpIds.includes(targets[targetIndex])) {
  //       // Add partition id selection error
  //       this.expPointAndIdErrors.push(this.partitionErrorMessages[5]);
  //       break;
  //     }
  //   }
  // }

  // removePartitionName(partition) {
  //   delete partition.target;
  //   return partition;
  // }

  isFormValid() {
    // return (
    //   // !this.partitionPointErrors.length &&
    //   // !this.expPointAndIdErrors.length &&
    //   // this.factorialExperimentDesignForm.valid &&
    //   // !this.conditionCodeErrors.length &&
    //   // this.partitionCountError === null &&
    //   // this.conditionCountError === null
    // );
  }

  validateForm() {
    // this.validateConditionCodes(this.factorialExperimentDesignForm.get('conditions').value);
    // this.validateConditionCount((this.factorialExperimentDesignForm.get('conditions') as FormArray).getRawValue());
    // this.validatePartitionCount(this.factorialExperimentDesignForm.get('partitions').value);
    // this.validateHasConditionCodeDefault(this.factorialExperimentDesignForm.get('conditions').value);
    // this.validateHasAssignmentWeightsNegative((this.factorialExperimentDesignForm.get('conditions') as FormArray).getRawValue());
  }

  emitEvent(eventType: NewExperimentDialogEvents) {
    switch (eventType) {
      case NewExperimentDialogEvents.CLOSE_DIALOG:
        if (
          this.factorialExperimentDesignForm.dirty ||
          this.experimentDesignStepperService.getHasExperimentDesignStepperDataChanged()
        ) {
          this.dialogService
            .openConfirmDialog()
            .afterClosed()
            .subscribe((res) => {
              if (res) {
                this.emitExperimentDialogEvent.emit({ type: eventType });
              }
            });
        } else {
          this.emitExperimentDialogEvent.emit({ type: eventType });
        }
        break;
      case NewExperimentDialogEvents.SEND_FORM_DATA:
        if (this.factorialExperimentDesignForm.dirty) {
          this.experimentDesignStepperService.experimentStepperDataChanged();
        }
        if (!this.isExperimentEditable) {
          this.emitExperimentDialogEvent.emit({
            type: eventType,
            formData: this.experimentInfo,
            path: NewExperimentPaths.EXPERIMENT_DESIGN,
          });
          break;
        }
        this.saveData(eventType);
        break;
      case NewExperimentDialogEvents.SAVE_DATA:
        if (!this.isExperimentEditable) {
          this.emitExperimentDialogEvent.emit({
            type: eventType,
            formData: this.experimentInfo,
            path: NewExperimentPaths.EXPERIMENT_DESIGN,
          });
          break;
        }
        this.saveData(eventType);
        this.experimentDesignStepperService.experimentStepperDataReset();
        this.factorialExperimentDesignForm.markAsPristine();
        break;
    }
  }

  saveData(eventType) {
    this.validateForm();

    // TODO: Uncomment to validate partitions with predefined site and target
    // this.validatePartitions()
    // enabling Assignment weight for form to validate
    // if (
    //   !this.partitionPointErrors.length &&
    //   !this.expPointAndIdErrors.length &&
    //   !this.conditionCodeErrors.length &&
    //   !this.partitionCountError
    // ) {
    //   (this.factorialExperimentDesignForm.get('conditions') as FormArray).controls.forEach((control) => {
    //     control.get('assignmentWeight').enable({ emitEvent: false });
    //   });
    // }
    // if (this.isFormValid()) {
    //   const factorialExperimentDesignFormData = this.factorialExperimentDesignForm.value;
    //   let order = 1;
    //   factorialExperimentDesignFormData.conditions = factorialExperimentDesignFormData.conditions.map((condition, index) => {
    //     if (isNaN(condition.assignmentWeight)) {
    //       condition.assignmentWeight = Number(condition.assignmentWeight.slice(0, -1));
    //     }
    //     return this.experimentInfo
    //       ? { ...this.experimentInfo.conditions[index], ...condition, order: order++ }
    //       : { id: uuidv4(), ...condition, name: '', order: order++ };
    //   });
    //   order = 1;
    //   factorialExperimentDesignFormData.partitions = factorialExperimentDesignFormData.partitions.map((partition, index) => {
    //     return this.experimentInfo
    //       ? { ...this.experimentInfo.partitions[index], ...partition, order: order++ }
    //       : partition.target
    //       ? { ...partition, order: order++ }
    //       : { ...this.removePartitionName(partition), order: order++ };
    //   });
    //   factorialExperimentDesignFormData.conditionAliases = this.createExperimentConditionAliasRequestObject(
    //     this.aliasTableData,
    //     factorialExperimentDesignFormData.conditions,
    //     factorialExperimentDesignFormData.partitions
    //   );
    //   this.emitExperimentDialogEvent.emit({
    //     type: eventType,
    //     formData: factorialExperimentDesignFormData,
    //     path: NewExperimentPaths.EXPERIMENT_DESIGN,
    //   });
    //   // scroll back to the conditions table
    //   this.scrollToFactorsTable();
    // }
  }

  // createExperimentConditionAliasRequestObject(
  //   aliases: ExperimentAliasTableRow[],
  //   conditions: ExperimentCondition[],
  //   decisionPoints: ExperimentPartition[]
  // ): ExperimentConditionAliasRequestObject[] {
  //   const conditionAliases: ExperimentConditionAliasRequestObject[] = [];

  //   aliases.forEach((aliasRowData: ExperimentAliasTableRow) => {
  //     // if no custom alias, return early, do not add to array to send to backend
  //     if (aliasRowData.alias === aliasRowData.condition) {
  //       return;
  //     }

  //     const parentCondition = conditions.find((condition) => condition.conditionCode === aliasRowData.condition);

  //     const decisionPoint = decisionPoints.find(
  //       (decisionPoint) => decisionPoint.target === aliasRowData.target && decisionPoint.site === aliasRowData.site
  //     );

  //     // need some error-handling in UI to prevent creation if aliases can't be created...
  //     if (!parentCondition || !decisionPoint) {
  //       console.log('cannot create alias data, cannot find id of parent condition/decisionpoint');
  //       return;
  //     }

  //     conditionAliases.push({
  //       id: aliasRowData.id || uuidv4(),
  //       aliasName: aliasRowData.alias,
  //       parentCondition: parentCondition.id,
  //       decisionPoint: decisionPoint.id,
  //     });
  //   });

  //   return conditionAliases;
  // }

  // applyEqualWeight() {
  //   if (this.factorialExperimentDesignForm) {
  //     const conditions = this.factorialExperimentDesignForm.get('conditions') as FormArray;
  //     if (this.equalWeightFlag) {
  //       const len = conditions.controls.length;
  //       this.previousAssignmentWeightValues = [];
  //       conditions.controls.forEach((control) => {
  //         control.get('assignmentWeight').setValue(parseFloat((100.0 / len).toFixed(1)).toString());
  //         this.previousAssignmentWeightValues.push(control.get('assignmentWeight').value);
  //         control.get('assignmentWeight').disable();
  //       });
  //     } else {
  //       conditions.controls.forEach((control, index) => {
  //         control
  //           .get('assignmentWeight')
  //           .setValue(
  //             control.value.assignmentWeight
  //               ? control.value.assignmentWeight
  //               : this.previousAssignmentWeightValues[index]
  //           );
  //         if (this.isExperimentEditable) {
  //           control.get('assignmentWeight').enable();
  //         }
  //       });
  //     }
  //   }
  // }

  // changeEqualWeightFlag(event) {
  //   event.checked ? (this.equalWeightFlag = true) : (this.equalWeightFlag = false);
  //   this.applyEqualWeight();
  // }

  scrollToConditionsTable(): void {
    this.stepContainer.nativeElement.scroll({
      top: this.stepContainer.nativeElement.scrollHeight / 2,
      behavior: 'smooth',
      duration: 500,
      easing: 'easeOutCubic',
    });
  }

  scrollToFactorsTable(): void {
    this.stepContainer.nativeElement.scroll({
      top: 0,
      behavior: 'smooth',
      duration: 500,
      easing: 'easeOutCubic',
    });
  }

  // get condition(): FormArray {
  //   return this.factorialExperimentDesignForm.get('conditions') as FormArray;
  // }

  // get partition(): FormArray {
  //   return this.factorialExperimentDesignForm.get('partitions') as FormArray;
  // }

  get factor(): FormArray {
    return this.factorialExperimentDesignForm.get('factors') as FormArray;
  }

  get level(): FormArray {
    return this.factorialExperimentDesignForm.get('levels') as FormArray;
  }

  get NewExperimentDialogEvents() {
    return NewExperimentDialogEvents;
  }

  get ExperimentState() {
    return EXPERIMENT_STATE;
  }

  ngOnDestroy() {
    // this.allPartitionsSub.unsubscribe();
    this.allFactorsSub?.unsubscribe();
    // this.partitionErrorMessagesSub.unsubscribe();
    this.contextMetaDataSub?.unsubscribe();
    // this.designDataSub.unsubscribe();
  }
}

export interface FactorElement {
  factor: string;
  site: string;
  target: string;
  levels: LevelElement[];
}

export interface LevelElement {
  level: string;
  alias: string;
}

const ELEMENT_DATA: FactorElement[] = [
  // {
  //   factor: "F1",
  //   site: "Point-1",
  //   target: "Id-1",
  //   levels: [{
  //     level: "F1L01",
  //     alias: "F1A01"
  //   },
  //   {
  //     level: "F1L02",
  //     alias: "F1A02"
  //   }]
  // },
  // {
  //   factor: "F2",
  //   site: "Point-2",
  //   target: "Id-2",
  //   levels: [{
  //     level: "F2L01",
  //     alias: "F2A01"
  //   }]
  // }
];