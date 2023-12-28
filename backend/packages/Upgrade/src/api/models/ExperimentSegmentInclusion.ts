import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base/BaseModel';
import { Experiment } from './Experiment';
import { Segment } from './Segment';

@Entity()
export class ExperimentSegmentInclusion extends BaseModel {
  @PrimaryColumn()
  public segmentId: string;

  @OneToOne(() => Segment, (segment) => segment.experimentSegmentInclusion, { onDelete: 'CASCADE' })
  @JoinColumn()
  public segment: Segment;

  @PrimaryColumn()
  public experimentId: string;
  @OneToOne(() => Experiment, (experiment) => experiment.experimentSegmentInclusion, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public experiment: Experiment;
}
