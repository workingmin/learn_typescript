import {Controller, Get} from '@nestjs/common';
import { DatabaseInstance } from 'src/models/database-instance.entity';
import { InstancesService } from './instances.service';

@Controller('instances')
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}
  
  @Get()
  async getAll(): Promise<DatabaseInstance[]> {
    return this.instancesService.getAll();
  }
}
