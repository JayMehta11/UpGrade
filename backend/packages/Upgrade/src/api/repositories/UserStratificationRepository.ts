import { Repository } from 'typeorm';
import { UserStratificationFactor } from '../models/UserStratificationFactor';
import { InjectRepository } from 'typeorm-typedi-extensions';

@InjectRepository(UserStratificationFactor)
export class UserStratificationFactorRepository extends Repository<UserStratificationFactor> {}
