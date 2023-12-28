import { InjectRepository } from 'typeorm-typedi-extensions';
import { ExplicitIndividualAssignment } from '../models/ExplicitIndividualAssignment';
import { Repository } from 'typeorm';

@InjectRepository(ExplicitIndividualAssignment)
export class ExplicitIndividualAssignmentRepository extends Repository<ExplicitIndividualAssignment> {}
