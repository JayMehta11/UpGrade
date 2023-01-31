import { Entity, PrimaryColumn, Column, ManyToOne, Index } from 'typeorm';
import { BaseModel } from './base/BaseModel';
import { ExperimentCondition } from './ExperimentCondition';
import { DecisionPoint } from './DecisionPoint';

@Entity()
export class ConditionAlias extends BaseModel {
  @PrimaryColumn('uuid')
  public id: string;

  @Column()
  public aliasName: string;

  @Index()
  @ManyToOne(() => ExperimentCondition, (condition) => condition.conditionAliases, { onDelete: 'CASCADE' })
  public parentCondition: ExperimentCondition;

  @Index()
  @ManyToOne(() => DecisionPoint, (decisionPoint) => decisionPoint.conditionAliases, { onDelete: 'CASCADE' })
  public decisionPoint: DecisionPoint;
}
