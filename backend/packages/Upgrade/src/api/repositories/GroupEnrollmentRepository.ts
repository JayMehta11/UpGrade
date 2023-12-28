import { In, Repository } from 'typeorm';
import { GroupEnrollment } from '../models/GroupEnrollment';
import { InjectRepository } from 'typeorm-typedi-extensions';

@InjectRepository(GroupEnrollment)
export class GroupEnrollmentRepository extends Repository<GroupEnrollment> {
  public findEnrollments(groupIds: string[], experimentIds: string[]): Promise<GroupEnrollment[]> {
    return this.find({
      where: { experiment: { id: In(experimentIds) }, groupId: In(groupIds) },
      relations: ['experiment', 'condition'],
    });
  }
}
