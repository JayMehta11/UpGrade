import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ExperimentAuditLogRepository } from '../repositories/ExperimentAuditLogRepository';
import { ExperimentAuditLog } from '../models/ExperimentAuditLog';
import { EXPERIMENT_LOG_TYPE } from 'upgrade_types';

@Service()
export class AuditService {
  constructor(
    @InjectRepository()
    private experimentAuditLogRepository: ExperimentAuditLogRepository
  ) {}

  public getAuditLogByType(type: EXPERIMENT_LOG_TYPE): Promise<ExperimentAuditLog[]> {
    return this.experimentAuditLogRepository.findBy({ type });
  }
}
