import { InjectRepository } from 'typeorm-typedi-extensions';
import { StateTimeLog } from '../models/StateTimeLogs';
import { Repository } from 'typeorm';

@InjectRepository(StateTimeLog)
export class StateTimeLogsRepository extends Repository<StateTimeLog> {}
