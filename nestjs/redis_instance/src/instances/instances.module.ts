import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseInstance } from 'src/models/database-instance.entity';
import { InstancesController } from './instances.controller';
import { InstancesService } from './instances.service';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseInstance])],
  providers: [InstancesService],
  controllers: [InstancesController],
})
export class InstancesModule {}
