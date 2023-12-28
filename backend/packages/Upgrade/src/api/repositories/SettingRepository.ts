import { InjectRepository } from 'typeorm-typedi-extensions';
import { Setting } from '../models/Setting';
import { Repository } from 'typeorm';

@InjectRepository(Setting)
export class SettingRepository extends Repository<Setting> {}
