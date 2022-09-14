import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseInstance } from '../models/database-instance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstancesService {
  constructor(
    @InjectRepository(DatabaseInstance)
    private databaseInstanceRepository: Repository<DatabaseInstance>,
    ) {}

  async getAll(): Promise<DatabaseInstance[]> {
    return this.databaseInstanceRepository
      .createQueryBuilder('database_instance')
      .where('status = 0')
      .getMany();
  }
}
