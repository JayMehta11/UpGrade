import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseModel } from './base/BaseModel';
import { Segment } from './Segment';

@Entity()
export class IndividualForSegment extends BaseModel {
  @Index()
  @ManyToOne(() => Segment, (segment) => segment.individualForSegment, { onDelete: 'CASCADE', primary: true })
  public segment: Segment;

  @Column({ primary: true })
  public userId: string;
}
