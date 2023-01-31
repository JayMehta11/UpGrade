import { Column, Entity, ManyToOne, Index } from 'typeorm';
import { BaseModel } from './base/BaseModel';
import { Segment } from './Segment';

@Entity()
export class GroupForSegment extends BaseModel {
  @Index()
  @ManyToOne(() => Segment, (segment) => segment.groupForSegment, { onDelete: 'CASCADE', primary: true })
  public segment: Segment;

  @Column({ primary: true })
  public groupId: string;

  @Column({ primary: true })
  public type: string;
}
